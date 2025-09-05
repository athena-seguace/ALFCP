import type { ReactNode } from "react";
import NavBarComponent from "../components/shared/NavBar.component";
import ParticleBackgroundComponent from "../components/shared/ParticlesBackground.component";

interface LayoutProps {
    children: ReactNode;
}

const DefaultPageLayout: React.FC<LayoutProps> = (props) => {
    return (
        <>
            <div className="relative z-10 w-full min-h-screen pt-38 overflow-x-hidden overflow-y-auto bg-base">
                <ParticleBackgroundComponent />
                <NavBarComponent />
                {props.children}
            </div>
        </>
    );
};

export default DefaultPageLayout;
