#include <cmath>

#include "ALFCP/constants.h"
#include "ALFCP/rk4_integrator.h"
#include "ALFCP/model.h"


inline static Eigen::Vector4d compute_intital_state_space(const Eigen::Vector4d initial_state);
inline static alfcp::ModelCharacteristics compute_model_characteristics(const alfcp::ModelParameters);

namespace alfcp
{
	Model::Model(const ModelParameters parameters, const Eigen::Vector4d initial_state, const double step_time) :
		parameters_(parameters),
		characteristics_(compute_model_characteristics(parameters)),
		state_space_(compute_intital_state_space(initial_state)),
		step_time_(step_time),
		simulation_time_(0.0),
		integrator_(
			[this](const Eigen::Vector4d& state_space, const double simulation_time) {
				return this->dervFunction(state_space, simulation_time);
			},
			step_time
		)
	{}

	Model::Model(const ModelCharacteristics characteristics, const Eigen::Vector4d initial_state, const double step_time) :
		parameters_({ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 }),
		characteristics_(characteristics),
		state_space_(compute_intital_state_space(initial_state)),
		step_time_(step_time),
		simulation_time_(0.0),
		integrator_(
			[this](const Eigen::Vector4d& state_space, const double simulation_time) {
				return this->dervFunction(state_space, simulation_time);
			},
			step_time
		)
	{}

	const Eigen::Vector4d Model::dervFunction(const Eigen::Vector4d& state, double time) const
	{
		Eigen::Vector4d derivative(4);

		derivative(0) = state(1);
		derivative(1) = -1.0 * characteristics_.omega_0_sqrd_ * state(0);
		derivative(2) = state(3);
		derivative(3) = -1.0 * characteristics_.omega_1_sqrd_ * state(2) - characteristics_.static_bias_;

		return derivative;
	}

	const Eigen::Vector4d Model::get_state_space() const
	{
		return state_space_;
	}

	void Model::step()
	{
		state_space_ = integrator_.step(state_space_, simulation_time_);
		simulation_time_ += step_time_;
	}
}


inline static Eigen::Vector4d compute_intital_state_space(const Eigen::Vector4d initial_state) {
	return {
		initial_state(0) + initial_state(2),
		initial_state(1) + initial_state(3),
		initial_state(0) - initial_state(2),
		initial_state(1) - initial_state(3),
	};
}

inline static alfcp::ModelCharacteristics compute_model_characteristics(const alfcp::ModelParameters parameters) {
	alfcp::ModelCharacteristics characteristics = { 0.0, 0.0, 0.0 };

	double C = parameters.l_ * alfcp::constants::GRAVITY *
		(parameters.m_ - parameters.m_prime_ / 2.0);

	double Cab = 0.25 * parameters.m_prime_ * alfcp::constants::GRAVITY *
		parameters.d1_ * parameters.d1_ * parameters.d2_ * parameters.d2_ /
		pow(parameters.d2_ * parameters.d2_ - parameters.a_ * parameters.a_, 1.5);

	double t_naught = 0.5 * parameters.m_prime_ * alfcp::constants::GRAVITY *
		parameters.d1_ * parameters.a_ /
		sqrt(parameters.d2_ * parameters.d2_ - parameters.a_ * parameters.a_);

	characteristics.omega_0_sqrd_ = C / parameters.I_;
	characteristics.omega_1_sqrd_ = (C + 2.0 * Cab) / parameters.I_;
	characteristics.static_bias_ = 2.0 * t_naught / parameters.I_;
	// characteristics.static_bias_ = 0.0;

	return characteristics;
}

