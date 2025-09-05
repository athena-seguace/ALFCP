import { useState } from "react";
import SimDataLoaderComponent from "../components/custom/SimDataLoader.component";
import SimDataAnalyzerComponent from "../components/custom/SimDataAnalyzer.component";
import DefaultPageLayout from "../layout/DefaultPage.layout";

interface SimulationDataPoint {
    time: number;
    theta1: number;
    omega1: number;
    theta2: number;
    omega2: number;
    lensX: number;
    lensY: number;
}

const AnalyzePage = () => {
    const [data, setData] = useState<SimulationDataPoint[]>([]);
    const [analysisSampleRate, setAnalysisSampleRate] = useState(20);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

    return (
        <>
            <DefaultPageLayout>
                <div className="w-full">
                    {!isDataLoaded ? (
                        <SimDataLoaderComponent
                            setData={setData}
                            setAnalysisSampleRate={setAnalysisSampleRate}
                            setIsDataLoaded={setIsDataLoaded}
                        />
                    ) : (
                        <SimDataAnalyzerComponent
                            data={data}
                            analysisSampleRate={analysisSampleRate}
                        />
                    )}
                </div>
            </DefaultPageLayout>
        </>
    );
};

export default AnalyzePage;
