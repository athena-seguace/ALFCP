#ifndef ALFCP_CONFIG_HPP
#define ALFCP_CONFIG_HPP


namespace alfcp {
	namespace app {
		constexpr const char* APP_SHORT_NAME = "ALFCP";
		constexpr const char* APP_FULL_NAME  = "Analysis of Lisijious Figures in Coupled Pendulum";
		constexpr const char* APP_TITLE      = "ALFCP";

		constexpr const unsigned SCREEN_FRAME_RATE = 60;

		constexpr const unsigned SCREEN_WIDTH = 800;
		constexpr const unsigned SCREEN_HEIGHT= 800;
	}
	
	namespace constants {

		constexpr double GRAVITY     = 9.80665;
		constexpr double PI          = 3.14159265359;

		constexpr double RAD_TO_DEG  = 180.0 / PI;
		constexpr double DEG_TO_RAD  = PI / 180.0;

	}
}


#endif
