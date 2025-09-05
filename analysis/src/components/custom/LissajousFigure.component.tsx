import React, { useRef, useEffect, useState } from "react";

interface SimulationDataPoint {
    time: number;
    theta1: number;
    omega1: number;
    theta2: number;
    omega2: number;
    lensX: number;
    lensY: number;
}

type LissajousFigureRenderingMode = "full" | "trail" | "dot";

interface ILissajousFigureComponentProps {
    data: SimulationDataPoint[];
    trailLength?: number;
}

const LissajousFigureComponent: React.FC<ILissajousFigureComponentProps> = (
    props
) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [playing, setPlaying] = useState(false);
    const [frame, setFrame] = useState(0);
    const [renderingMode, setRenderingMode] =
        useState<LissajousFigureRenderingMode>("full");
    const trailLength = Math.floor(props.trailLength || 100);

    const timeStep = props.data[1].time - props.data[0].time;

    const maxLensX = Math.max(...props.data.map((d) => Math.abs(d.lensX)));
    const maxLensY = Math.max(...props.data.map((d) => Math.abs(d.lensY)));
    const maxLensXY = Math.max(maxLensX, maxLensY);

    useEffect(() => {
        if (!playing) return;

        let animationId: number;
        let lastUpdate = performance.now();
        const FRAME_INTERVAL = 1000 / 20;

        const animate = (timestamp: number) => {
            const elapsed = timestamp - lastUpdate;
            if (elapsed >= FRAME_INTERVAL) {
                setFrame((prev) => (prev + 1) % props.data.length);
                lastUpdate = timestamp;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [playing, props.data.length]);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        ctx.clearRect(0, 0, width, height);

        if (renderingMode == "full") {
            ctx.beginPath();
            ctx.strokeStyle = "#32a852";
            ctx.lineWidth = 1;

            for (let i = 0; i < frame; i++) {
                const { lensX, lensY } = props.data[i];
                const x = (((lensX * 0.9) / maxLensXY + 1.0) * width) / 2.0;
                const y = (((lensY * 0.9) / maxLensXY + 1.0) * height) / 2.0;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();
        } else if (renderingMode == "trail") {
            for (let i = Math.max(0, frame - trailLength); i < frame; i++) {
                const alpha = (i - (frame - trailLength)) / trailLength;
                const { lensX, lensY } = props.data[i];
                const x = (((lensX * 0.9) / maxLensXY + 1.0) * width) / 2.0;
                const y = (((lensY * 0.9) / maxLensXY + 1.0) * height) / 2.0;

                ctx.beginPath();
                ctx.fillStyle = `rgba(50, 168, 82, ${alpha.toFixed(2)})`;
                ctx.arc(x, y, 1, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        if (frame < props.data.length) {
            const { lensX, lensY } = props.data[frame];
            const x = (((lensX * 0.9) / maxLensXY + 1.0) * width) / 2.0;
            const y = (((lensY * 0.9) / maxLensXY + 1.0) * height) / 2.0;

            ctx.beginPath();
            ctx.fillStyle = "#f2f542";
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }, [frame, props.data, renderingMode]);

    const exportImage = () => {
        const originalCanvas = canvasRef.current;
        if (!originalCanvas) return;

        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = 5000;
        exportCanvas.height = 5000;
        const ctx = exportCanvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        const width = exportCanvas.width;
        const height = exportCanvas.height;

        const drawPoint = (lensX: number, lensY: number) => {
            const x = (((lensX * 0.9) / maxLensXY + 1.0) * width) / 2.0;
            const y = (((lensY * 0.9) / maxLensXY + 1.0) * height) / 2.0;
            return { x, y };
        };

        if (renderingMode === "full") {
            ctx.beginPath();
            ctx.strokeStyle = "#32a852";
            ctx.lineWidth = 2;

            for (let i = 0; i < frame; i++) {
                const { lensX, lensY } = props.data[i];
                const { x, y } = drawPoint(lensX, lensY);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();
        } else if (renderingMode === "trail") {
            for (let i = Math.max(0, frame - trailLength); i < frame; i++) {
                const alpha = (i - (frame - trailLength)) / trailLength;
                const { lensX, lensY } = props.data[i];
                const { x, y } = drawPoint(lensX, lensY);

                ctx.beginPath();
                ctx.fillStyle = `rgba(50, 168, 82, ${alpha.toFixed(2)})`;
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        if (frame < props.data.length) {
            const { lensX, lensY } = props.data[frame];
            const { x, y } = drawPoint(lensX, lensY);

            ctx.beginPath();
            ctx.fillStyle = "#f2f542";
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.fillStyle = "#ffffff";
        ctx.font = "64px Mono";
        ctx.textBaseline = "top";
        ctx.fillText(`Time: ${(frame * timeStep).toFixed(2)} sec`, 20, 20);
        ctx.fillText(`Mode: ${renderingMode.toUpperCase()}`, 20, 100);

        const image = exportCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "lissajous-figure.png";
        link.click();
    };

    return (
        <div className="flex flex-col gap-3">
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="bg-[#000000]"
            />
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <p className="text-t-primary text-sm">
                        Time: {(frame * timeStep).toFixed(2)} sec
                    </p>
                    <input
                        className="flex-1"
                        type="range"
                        min="0"
                        max={props.data.length - 1}
                        value={frame}
                        onChange={(e) => setFrame(Number(e.target.value))}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <select
                            className="px-2 py-1 bg-surface text-t-primary text-sm border border-separator rounded-md focus:outline-none"
                            value={renderingMode}
                            onChange={(e) =>
                                setRenderingMode(
                                    e.target
                                        .value as LissajousFigureRenderingMode
                                )
                            }
                        >
                            <option id="full" value="full">
                                Full
                            </option>
                            <option id="trail" value="trail">
                                Trail
                            </option>
                            <option id="dot" value="dot">
                                Dot
                            </option>
                        </select>
                        <button
                            className="text-t-primary text-sm bg-surface border border-separator px-2 py-1 rounded-md hover:cursor-pointer"
                            onClick={() => setPlaying(!playing)}
                        >
                            {playing ? "Pause Animation" : "Play Animation"}
                        </button>
                    </div>
                    <button
                        className="text-t-primary text-sm bg-surface border border-separator px-2 py-1 rounded-md hover:cursor-pointer"
                        onClick={() => exportImage()}
                    >
                        Export Image
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LissajousFigureComponent;
