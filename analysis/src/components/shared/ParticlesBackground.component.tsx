import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const ParticleBackgroundComponent = () => {
    const particlesInit = async (main: Engine) => {
        await loadSlim(main);
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: { enable: true, zIndex: -1 },
                particles: {
                    color: { value: "#00bcd4" },
                    links: {
                        enable: true,
                        color: "#00bcd4",
                        distance: 100,
                    },
                    move: {
                        enable: true,
                        speed: 0.6,
                    },
                    number: {
                        value: 50,
                    },
                    opacity: {
                        value: 0.4,
                    },
                    size: {
                        value: 2,
                    },
                },
            }}
        />
    );
};

export default ParticleBackgroundComponent;
