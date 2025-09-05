#include <iostream>
#include <iomanip>
#include <cmath>
#include <fstream>
#include <Eigen/Dense>

#include "libs/nlohmann-json/json.hpp"
#include "ALFCP/constants.h"
#include "ALFCP/rk4_integrator.h"
#include "ALFCP/model.h"

struct SimulationDataPoint {
    double time;
    double theta1;
    double omega1;
    double theta2;
    double omega2;
    double lensX;
    double lensY;
};

void writeSimulationDataToCSV(const std::string& filename, const std::vector<SimulationDataPoint>& data);

int main(int argc, char* argv[])
{
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <input_file.json> <output_file.csv>\n\n";
        return 1;
    }

    std::string config_file_path = argv[1];
    std::string output_file_path = argv[2];

    std::ifstream file(config_file_path);
    if (!file.is_open()) {
        std::cerr << "Failed to open configuration file.\n\n";
        return 1;
    }

    nlohmann::json json;
    try {
        file >> json;
    }
    catch (const nlohmann::json::parse_error& e) {
        std::cerr << "Parse error: " << e.what() << "\n\n";
        return 1;
    }

    if (!json.contains("step_time") || !json.contains("final_time") ||
        !json.contains("sample_rate") || !json.contains("mode") ||
        !json.contains("initial_theta1") || !json.contains("initial_theta2")) {
        std::cerr << "Config file missing key parameters.\n";
        return 1;
    }

    const double step_time = json["step_time"].get<double>();
    const double final_time = json["final_time"].get<double>();
    const int sample_rate = json["sample_rate"].get<int>();
    const int initial_theta1 = json["initial_theta1"].get<int>();
    const int initial_theta2= json["initial_theta2"].get<int>();
    const std::string mode = json["mode"].get<std::string>();

    const Eigen::Vector4d initial_state = {
        initial_theta1 * alfcp::constants::DEG_TO_RAD,
        0.0,
        initial_theta2 * alfcp::constants::DEG_TO_RAD,
        0.0
    };

    alfcp::Model *model = nullptr;

    if (mode == "p") {
        std::vector<std::string> required_keys = { "m", "l", "m_prime", "a", "d1", "d2", "I" };
        for (const auto& key : required_keys) {
            if (!json.contains(key)) {
                std::cerr << "Config file missing parameter: " << key << "\n\n";
                return 1;
            }
        }

        alfcp::ModelParameters model_parameters = {
            json["m"].get<double>(),
            json["l"].get<double>(),
            json["m_prime"].get<double>(),
            json["a"].get<double>(),
            json["d1"].get<double>(),
            json["d2"].get<double>(),
            json["I"].get<double>()
        };

        model = new alfcp::Model({ model_parameters, initial_state, step_time });
    }
    else if (mode == "c") {
        std::vector<std::string> required_keys = { "omega_0_sqrd", "omega_1_sqrd", "static_bias" };
        for (const auto& key : required_keys) {
            if (!json.contains(key)) {
                std::cerr << "Missing parameter: " << key << "\n\n";
                return 1;
            }
        }

        alfcp::ModelCharacteristics model_characteristics = {
            json["omega_0_sqrd"].get<double>(),
            json["omega_1_sqrd"].get<double>(),
            json["static_bias"].get<double>()
        };

        model = new alfcp::Model({ model_characteristics, initial_state, step_time });
    }
    else {
        std::cerr << "Config file has unknown mode: " << mode << ". Expected 'p' or 'c'.\n\n";
        return 1;
    }

    std::vector<SimulationDataPoint> simulation_data;

    for (unsigned i = 0; i <= (final_time / step_time); i++) {
        if (i % (int)(1.0 / (sample_rate * step_time)) == 0) {
            auto state = model->get_state_space();

            double theta1 = ((state(0) + state(2)) / 2.0) * alfcp::constants::RAD_TO_DEG;
            double theta2 = ((state(0) - state(2)) / 2.0) * alfcp::constants::RAD_TO_DEG;

            double omega1 = ((state(1) + state(3)) / 2.0) * alfcp::constants::RAD_TO_DEG;
            double omega2 = ((state(1) - state(3)) / 2.0) * alfcp::constants::RAD_TO_DEG;

            double d3theta1byRoot2 = theta1 * 0.707106781187;
            double d3theta2byRoot2 = theta2 * 0.707106781187;

            double lensX = -1.0 * d3theta1byRoot2 - d3theta2byRoot2;
            double lensY = d3theta1byRoot2 - d3theta2byRoot2;

            simulation_data.push_back({
                i * step_time,
                theta1,
                theta1,
                theta2,
                theta2,
                lensX,
                lensY
            });
        }

        model->step();
    }

    writeSimulationDataToCSV(output_file_path, simulation_data);
    std::cout << "Simulation data written to: " << output_file_path << "\n\n";
    
    return 0;
}

void writeSimulationDataToCSV(const std::string& filename, const std::vector<SimulationDataPoint>& data) {
    std::ofstream out(filename);
    if (!out.is_open()) {
        std::cerr << "Failed to open output file: " << filename << '\n';
        return;
    }

    out << "time,theta1,omega1,theta2,omega2,lensX,lensY\n";

    for (const auto& point : data) {
        out << point.time << ','
            << point.theta1 << ','
            << point.omega1 << ','
            << point.theta2 << ','
            << point.omega2 << ','
            << point.lensX << ','
            << point.lensY << '\n';
    }

    out.close();
}
