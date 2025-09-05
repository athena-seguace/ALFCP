#ifndef ALFCP_INTEGRATOR_HPP
#define ALFCP_INTEGRATOR_HPP

#include <Eigen/Dense>
#include <functional>


namespace alfcp {
    template <typename State>
    class RK4Integrator {
    public:
        using Function = std::function<State(const State&, const double)>;

        RK4Integrator(const Function function, const double step_time) :
            function_(std::move(function)),
            step_time_(step_time)
        {}

        State step(const State& state, const double time) const
        {
            const State k1 = function_(state, time);
            const State k2 = function_(state + (step_time_ / 2.0) * k1, time + step_time_ / 2.0);
            const State k3 = function_(state + (step_time_ / 2.0) * k2, time + step_time_ / 2.0);
            const State k4 = function_(state + step_time_ * k3, time + step_time_);

            return state + (step_time_ / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
        }

    private:
        const double step_time_;
        const Function function_;
    };
}

#endif