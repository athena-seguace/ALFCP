interface SimulationDataPoint {
    time: number;
    theta1: number;
    omega1: number;
    theta2: number;
    omega2: number;
    lensX: number;
    lensY: number;
}

function linearInterpolation(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x: number
): number {
    if (x1 === x0) return y0;
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}

function interpolate(
    data: SimulationDataPoint[],
    t: number
): SimulationDataPoint | null {
    if (t < data[0].time || t > data[data.length - 1].time) {
        return null;
    }

    let i = 0;
    while (i < data.length - 1 && data[i + 1].time < t) {
        i++;
    }

    const p0 = data[i];
    const p1 = data[i + 1];

    return {
        time: t,
        theta1: linearInterpolation(p0.time, p0.theta1, p1.time, p1.theta1, t),
        omega1: linearInterpolation(p0.time, p0.omega1, p1.time, p1.omega1, t),
        theta2: linearInterpolation(p0.time, p0.theta2, p1.time, p1.theta2, t),
        omega2: linearInterpolation(p0.time, p0.omega2, p1.time, p1.omega2, t),
        lensX: linearInterpolation(p0.time, p0.lensX, p1.time, p1.lensX, t),
        lensY: linearInterpolation(p0.time, p0.lensY, p1.time, p1.lensY, t),
    };
}

function resampleData(
    data: SimulationDataPoint[],
    targetSampleRate: number
): SimulationDataPoint[] {
    if (data.length < 2) return data;

    const startTime = data[0].time;
    const endTime = data[data.length - 1].time;
    const dt = 1 / targetSampleRate;

    const resampled: SimulationDataPoint[] = [];

    for (let t = startTime; t <= endTime; t += dt) {
        const point = interpolate(data, t);
        if (point) {
            resampled.push(point);
        }
    }

    return resampled;
}

export default resampleData;
