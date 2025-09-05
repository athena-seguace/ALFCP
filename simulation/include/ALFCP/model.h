#ifndef ALFCP_MODEL_HPP
#define ALFCP_MODEL_HPP

#include <Eigen/Dense>
#include <functional>

#include "rk4_integrator.h"


namespace alfcp {
    struct ModelParameters {
        double m_;
        double l_;
        double m_prime_;
        double a_;
        double d1_;
        double d2_;
        double I_;
    };

    struct ModelCharacteristics {
        double omega_0_sqrd_;
        double omega_1_sqrd_;
        double static_bias_;
    };

    class Model {
    public:
        Model(const ModelParameters, const Eigen::Vector4d, const double);
        Model(const ModelCharacteristics, const Eigen::Vector4d, const double);

        const Eigen::Vector4d get_state_space() const;

        void step();

    private:
        const ModelParameters parameters_;
        const ModelCharacteristics characteristics_;
        const double step_time_;

        const RK4Integrator<Eigen::Vector4d> integrator_;
        const Eigen::Vector4d dervFunction(const Eigen::Vector4d&, const double) const;

        double simulation_time_;
        Eigen::Vector4d state_space_;
    };
}

#endif

