import Plot from "react-plotly.js";
import resampleData from "../../utils/resampleData";
import LissajousFigureComponent from "./LissajousFigure.component";
import { useMemo } from "react";

interface SimulationDataPoint {
    time: number;
    theta1: number;
    omega1: number;
    theta2: number;
    omega2: number;
    lensX: number;
    lensY: number;
}

interface ISimDataAnalyzerComponentProps {
    data: SimulationDataPoint[];
    analysisSampleRate: number;
}

const SimDataAnalyzerComponent: React.FC<ISimDataAnalyzerComponentProps> = (
    props
) => {
    const dataAtTargetRendingSampleRate = useMemo(() => {
        return resampleData(props.data, props.analysisSampleRate);
    }, [props.data, props.analysisSampleRate]);

    const originalSampleRate = useMemo(() => {
        if (props.data.length < 2) return 0;
        return Math.floor(1 / (props.data[1].time - props.data[0].time));
    }, [props.data]);

    const timeRange = useMemo(() => {
        const lastTime = props.data[props.data.length - 1]?.time || 0;
        return `0 - ${lastTime} sec`;
    }, [props.data]);

    const metaDataRows = [
        { label: "Data Points", value: props.data.length },
        { label: "Simulation Time Step", value: "0.001 sec" },
        { label: "Time Range", value: timeRange },
        { label: "Simulation Sample Rate", value: `${originalSampleRate} Hz` },
        {
            label: "Analysis Sample Rate",
            value: `${props.analysisSampleRate} Hz`,
        },
    ];

    return (
        <>
            <div className="flex flex-col items-center gap-20 px-10">
                {/* Analysis Meta Data */}
                <div className="w-full max-w-100">
                    <h1 className="text-t-primary text-2xl mb-3 text-center">
                        Analysis Meta Data
                    </h1>
                    <table className="w-full table-auto caption-bottom border-collapse border border-separator text-t-primary text-sm">
                        <caption>Table 1: Analysis meta data.</caption>
                        <thead>
                            <tr>
                                <th className="border border-separator px-4 py-2">
                                    Parameters
                                </th>
                                <th className="border border-separator px-4 py-2">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {metaDataRows.map(({ label, value }) => (
                                <tr key={label}>
                                    <td className="border border-separator px-4 py-2">
                                        {label}
                                    </td>
                                    <td className="border border-separator px-4 py-2">
                                        {value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Angular Displacement vs Time graph */}
                <div className="w-full max-w-250">
                    <h1 className="text-t-primary text-2xl mb-3 text-center">
                        Angular Displacement vs Time
                    </h1>
                    <Plot
                        data={[
                            {
                                x: dataAtTargetRendingSampleRate.map(
                                    (d) => d.time
                                ),
                                y: dataAtTargetRendingSampleRate.map(
                                    (d) => d.theta1
                                ),
                                type: "scattergl",
                                mode: "lines",
                                name: "θ₁",
                                line: { color: "#FF6F61", width: 0.75 },
                            },
                            {
                                x: dataAtTargetRendingSampleRate.map(
                                    (d) => d.time
                                ),
                                y: dataAtTargetRendingSampleRate.map(
                                    (d) => d.theta2
                                ),
                                type: "scattergl",
                                mode: "lines",
                                name: "θ₂",
                                line: { color: "#4CAF50", width: 0.75 },
                            },
                        ]}
                        layout={{
                            paper_bgcolor: "#0f172a",
                            plot_bgcolor: "#0f172a",
                            font: { color: "#ffffffd9" },
                            xaxis: {
                                title: { text: "Time (sec)" },
                                color: "#ffffffd9",
                                rangeslider: {
                                    visible: true,
                                    thickness: 0.05,
                                },
                                rangemode: "normal",
                                zerolinecolor: "#ffffff33",
                                showgrid: true,
                                gridcolor: "#ffffff33",
                            },
                            yaxis: {
                                title: { text: "Angular Displacement (rad)" },
                                color: "#ffffffd9",
                                zerolinecolor: "#ffffff33",
                                showgrid: true,
                                gridcolor: "#ffffff33",
                            },
                            legend: {
                                font: { color: "#ffffffd9" },
                            },
                            margin: { t: 40, r: 20, l: 60, b: 60 },
                            hovermode: "x unified",
                        }}
                        config={{
                            responsive: true,
                            scrollZoom: true,
                            displayModeBar: true,
                        }}
                        style={{ width: "100%", height: "500px" }}
                    />
                </div>

                {/* Lissajous Figure */}
                <div className="w-full max-w-200 flex flex-col items-center">
                    <h1 className="text-t-primary text-2xl mb-3 text-center">
                        Lissajous Figure
                    </h1>
                    <LissajousFigureComponent
                        data={dataAtTargetRendingSampleRate}
                    />
                </div>

                <div className="h-10"></div>
            </div>
        </>
    );
};

export default SimDataAnalyzerComponent;
