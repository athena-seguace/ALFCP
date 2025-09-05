import { Link } from "react-router-dom";
import DefaultPageLayout from "../layout/DefaultPage.layout";

const HomePage = () => {
    return (
        <>
            <DefaultPageLayout>
                <div className="w-full h-full flex flex-col justify-center items-center gap-10">
                    <div className="flex flex-col gap-3 text-t-primary text-center">
                        <h1 className="text-7xl">ALFCP</h1>
                        <h2 className="text-lg">
                            Analysis of Lissajous Figure in Coupled Pendulum.
                        </h2>
                    </div>
                    <div className="flex gap-5">
                        <Link
                            key="getting-started"
                            to="/simulate"
                            className="px-4 py-2 rounded-lg bg-surface border border-separator text-t-primary"
                        >
                            Get Started
                        </Link>
                        <Link
                            key="learn-more"
                            to="/learn"
                            className="px-4 py-2 rounded-lg border border-separator text-t-primary"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </DefaultPageLayout>
        </>
    );
};

export default HomePage;
