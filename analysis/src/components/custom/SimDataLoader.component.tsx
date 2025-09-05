import Papa from "papaparse";
import { useState } from "react";

interface SimulationDataPoint {
    time: number;
    theta1: number;
    omega1: number;
    theta2: number;
    omega2: number;
    lensX: number;
    lensY: number;
}

interface ISimDataLoaderComponentProps {
    setData: (data: SimulationDataPoint[]) => void;
    setAnalysisSampleRate: (sampleRate: number) => void;
    setIsDataLoaded: (loaded: boolean) => void;
}

const SimDataLoaderComponent: React.FC<ISimDataLoaderComponentProps> = (
    props
) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null);

        props.setIsDataLoaded(false);
        props.setData([]);
    };

    const handleConfirm = () => {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const csvText = event.target?.result as string;

            Papa.parse<SimulationDataPoint>(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    props.setData(results.data);
                    props.setIsDataLoaded(true);
                    console.log("Data parsed from file", file.name);
                    setFile(null);
                },
                error: (err: any) => {
                    console.error("CSV parsing error:", err);
                    props.setData([]);
                    props.setIsDataLoaded(false);
                    setFile(null);
                    alert("CSV Parsing error. Make sure the file is correct.");
                },
            });
        };

        reader.readAsText(file);
    };

    return (
        <>
            <div className="w-full flex flex-col items-center gap-6">
                <h1 className="text-t-primary text-3xl text-center">
                    Select a file for Analysis
                </h1>
                <div className="w-100 flex flex-col items-center gap-10">
                    <div>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="w-100 text-t-primary text-sm border border-separator rounded-md cursor-pointer file:bg-surface file:text-t-primary file:px-4 file:py-2 file:border-none hover:file:bg-surface"
                        />
                        <p className="text-t-primary text-xs">
                            Format must be correct.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-t-primary text-sm">
                            Select Analysis Sample Rate
                        </p>
                        <select
                            className="w-25 px-2 py-1 bg-surface text-t-primary text-sm border border-separator rounded-md focus:outline-none"
                            onChange={(e) =>
                                props.setAnalysisSampleRate(
                                    parseInt(e.target.value)
                                )
                            }
                        >
                            <option id="10" value={10}>
                                10 Hz
                            </option>
                            <option id="20" value={20}>
                                20 Hz
                            </option>
                            <option id="30" value={30}>
                                30 Hz
                            </option>
                            <option id="40" value={40}>
                                40 Hz
                            </option>
                            <option id="50" value={40}>
                                50 Hz
                            </option>
                            <option id="60" value={60}>
                                60 Hz
                            </option>
                        </select>
                    </div>
                    <button
                        onClick={handleConfirm}
                        disabled={!file}
                        className={`w-full py-2 rounded-md text-t-primary font-semibold
                        ${
                            file
                                ? "bg-primary hover:bg-primaryS cursor-pointer"
                                : "bg-separator cursor-not-allowed"
                        }`}
                    >
                        Analyze
                    </button>
                </div>
            </div>
        </>
    );
};

export default SimDataLoaderComponent;
