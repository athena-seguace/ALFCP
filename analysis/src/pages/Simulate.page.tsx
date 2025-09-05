import { useState } from "react";
import { toast } from "react-hot-toast";
import DefaultPageLayout from "../layout/DefaultPage.layout";

type SimulationModes = "p" | "c";

const SimulatePage = () => {
    const [simulationMode, setSimulationMode] = useState<SimulationModes>("c");

    const [initial_theta_1, setInitial_theta_1] = useState("");
    const [initial_theta_2, setInitial_theta_2] = useState("");

    const [step_time, setStep_time] = useState("");
    const [final_time, setFinal_time] = useState("");
    const [sample_rate, setSample_rate] = useState("");

    const [m, setM] = useState("");
    const [l, setL] = useState("");
    const [m_prime, setM_prime] = useState("");
    const [a, setA] = useState("");
    const [d1, setD1] = useState("");
    const [d2, setD2] = useState("");
    const [I, setI] = useState("");

    const [omega_0, setOmega_0] = useState("");
    const [omega_1, setOmega_1] = useState("");
    const [static_bias, setStatic_bias] = useState("");

    const handleSimulateTypeC = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            mode: "c",
            initial_theta1: parseFloat(initial_theta_1),
            initial_theta2: parseFloat(initial_theta_2),
            step_time: parseFloat(step_time),
            final_time: parseFloat(final_time),
            sample_rate: parseFloat(sample_rate),
            omega_0_sqrd: parseFloat(omega_0) * parseFloat(omega_0),
            omega_1_sqrd: parseFloat(omega_1) * parseFloat(omega_1),
            static_bias: parseFloat(static_bias),
        };

        try {
            const response = await fetch("http://localhost:5500/api/simulate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.status == 200) {
                let fileName = (await response.json()).fileName;
                toast.success("File Saved: " + fileName, {
                    duration: 3000,
                    position: "top-right",
                });
            } else {
                toast.error("Error: " + response.statusText, {
                    duration: 5000,
                    position: "top-right",
                });
            }
        } catch (error) {
            toast.error("Error: " + error, {
                duration: 5000,
                position: "top-right",
            });
        }
    };

    const handleSimulateTypeP = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            mode: "p",
            initial_theta1: parseFloat(initial_theta_1),
            initial_theta2: parseFloat(initial_theta_2),
            step_time: parseFloat(step_time),
            final_time: parseFloat(final_time),
            sample_rate: parseFloat(sample_rate),
            m: parseFloat(m),
            l: parseFloat(l),
            m_prime: parseFloat(m_prime),
            a: parseFloat(a),
            d1: parseFloat(d1),
            d2: parseFloat(d2),
            I: parseFloat(I),
        };

        try {
            const response = await fetch("http://localhost:5500/api/simulate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.status == 200) {
                let fileName = (await response.json()).fileName;
                toast.success("File Saved: " + fileName, {
                    duration: 3000,
                    position: "top-right",
                });
            } else {
                toast.error("Error: " + response.statusText, {
                    duration: 5000,
                    position: "top-right",
                });
            }
        } catch (error) {
            toast.error("Error: " + error, {
                duration: 5000,
                position: "top-right",
            });
        }
    };

    const handleNumberInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const value = e.target.value;
        setter(value);
    };

    return (
        <>
            <DefaultPageLayout>
                <div className="w-full flex flex-col items-center gap-6">
                    <h1 className="text-t-primary text-3xl text-center">
                        Fill out the parameters.
                    </h1>
                    <div className="w-50 flex items-center justify-between text-t-primary">
                        <p
                            className={`px-4 py-2 text-t-primary text-sm border border-separator hover:cursor-pointer rounded-md ${
                                simulationMode === "c" ? "bg-surface" : ""
                            }`}
                            onClick={() => setSimulationMode(() => "c")}
                        >
                            Type C
                        </p>
                        <p
                            className={`px-4 py-2 text-t-primary text-sm border border-separator hover:cursor-pointer rounded-md ${
                                simulationMode === "p" ? "bg-surface" : ""
                            }`}
                            onClick={() => setSimulationMode(() => "p")}
                        >
                            Type P
                        </p>
                    </div>
                    {simulationMode == "c" ? (
                        <form
                            onSubmit={handleSimulateTypeC}
                            className="w-full max-w-100 flex flex-col gap-3"
                        >
                            <div>
                                <p className="text-t-primary text-sm">
                                    Step Time
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={step_time}
                                    onChange={(e) =>
                                        handleNumberInput(e, setStep_time)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Final Time
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={final_time}
                                    onChange={(e) =>
                                        handleNumberInput(e, setFinal_time)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Sample Rate
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={sample_rate}
                                    onChange={(e) =>
                                        handleNumberInput(e, setSample_rate)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Initial Theta 1
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={initial_theta_1}
                                    onChange={(e) =>
                                        handleNumberInput(e, setInitial_theta_1)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Initial Theta 2
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={initial_theta_2}
                                    onChange={(e) =>
                                        handleNumberInput(e, setInitial_theta_2)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Omega 0
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={omega_0}
                                    onChange={(e) =>
                                        handleNumberInput(e, setOmega_0)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Omega 1
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={omega_1}
                                    onChange={(e) =>
                                        handleNumberInput(e, setOmega_1)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Static Bias
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={static_bias}
                                    onChange={(e) =>
                                        handleNumberInput(e, setStatic_bias)
                                    }
                                />
                            </div>
                            <div>
                                <p>&nbsp;</p>
                                <button
                                    type="submit"
                                    className="w-full py-2 rounded-md text-t-primary font-semibold bg-primary hover:bg-primaryS cursor-pointer"
                                >
                                    Simulate
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form
                            onSubmit={handleSimulateTypeP}
                            className="w-full max-w-100 flex flex-col gap-3"
                        >
                            <div>
                                <p className="text-t-primary text-sm">
                                    Step Time
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={step_time}
                                    onChange={(e) =>
                                        handleNumberInput(e, setStep_time)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Final Time
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={final_time}
                                    onChange={(e) =>
                                        handleNumberInput(e, setFinal_time)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Sample Rate
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={sample_rate}
                                    onChange={(e) =>
                                        handleNumberInput(e, setSample_rate)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Initial Theta 1
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={initial_theta_1}
                                    onChange={(e) =>
                                        handleNumberInput(e, setInitial_theta_1)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    Initial Theta 2
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={initial_theta_2}
                                    onChange={(e) =>
                                        handleNumberInput(e, setInitial_theta_2)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">m</p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={m}
                                    onChange={(e) => handleNumberInput(e, setM)}
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">l</p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={l}
                                    onChange={(e) => handleNumberInput(e, setL)}
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">
                                    m_prime
                                </p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={m_prime}
                                    onChange={(e) =>
                                        handleNumberInput(e, setM_prime)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">a</p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={a}
                                    onChange={(e) => handleNumberInput(e, setA)}
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">d1</p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={d1}
                                    onChange={(e) =>
                                        handleNumberInput(e, setD1)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">d2</p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={d2}
                                    onChange={(e) =>
                                        handleNumberInput(e, setD2)
                                    }
                                />
                            </div>
                            <div>
                                <p className="text-t-primary text-sm">I</p>
                                <input
                                    type="text"
                                    className="w-full text-t-secondary rounded-md border border-separator px-4 py-1 focus:outline-none"
                                    value={I}
                                    onChange={(e) => handleNumberInput(e, setI)}
                                />
                            </div>
                            <div>
                                <p>&nbsp;</p>
                                <button
                                    type="submit"
                                    className="w-full py-2 rounded-md text-t-primary font-semibold bg-primary hover:bg-primaryS cursor-pointer"
                                >
                                    Simulate
                                </button>
                            </div>
                        </form>
                    )}
                    <div className="h-20" />
                </div>
            </DefaultPageLayout>
        </>
    );
};

export default SimulatePage;
