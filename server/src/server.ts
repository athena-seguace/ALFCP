import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 5500;
const EXECUTABLE_PATH = path.resolve(
    process.env.SIM_EXECUTABLE || "./ALFCP-Simulation.exe"
);
const DATA_DIR = process.env.DATA_DIR || "./data";

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    const clientBuildPath = path.join(__dirname, "../client/build");
    app.use(express.static(clientBuildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(clientBuildPath, "index.html"));
    });
}

app.post("/api/simulate", async (req, res) => {
    console.log("Request: ", req.body);

    try {
        const body = req.body;

        if (typeof body !== "object" || Array.isArray(body) || body == null) {
            return res
                .status(400)
                .json({ error: "Invalid request body format." });
        }

        const {
            mode,
            initial_theta1,
            initial_theta2,
            step_time,
            final_time,
            sample_rate,
            m,
            l,
            m_prime,
            a,
            d1,
            d2,
            I,
            omega_0_sqrd,
            omega_1_sqrd,
            static_bias,
        } = body;

        const requiredCommon = [
            mode,
            initial_theta1,
            initial_theta2,
            step_time,
            final_time,
            sample_rate,
        ];
        if (requiredCommon.some((val) => val == null)) {
            return res
                .status(400)
                .json({ error: "Missing required common fields." });
        }

        if (mode === "c") {
            if (
                [omega_0_sqrd, omega_1_sqrd, static_bias].some(
                    (val) => val == null
                )
            ) {
                return res
                    .status(400)
                    .json({ error: "Missing required fields for mode 'c'." });
            }
        } else if (mode === "p") {
            if ([m, l, m_prime, a, d1, d2, I].some((val) => val == null)) {
                return res
                    .status(400)
                    .json({ error: "Missing required fields for mode 'p'." });
            }
        } else {
            return res
                .status(400)
                .json({ error: "Invalid mode. Must be 'c' or 'p'." });
        }

        const randomCode = Math.floor(100000 + Math.random() * 900000);
        const fileName = `data_${mode}_${initial_theta1}_${initial_theta2}_${randomCode}.csv`;
        const outputPath = path.join(DATA_DIR, fileName);
        const tempInputPath = path.join(__dirname, "temp_input.json");

        try {
            await fs.writeFile(tempInputPath, JSON.stringify(body));
        } catch (writeErr) {
            console.error("Failed to write temp input file:", writeErr);
            return res
                .status(500)
                .json({ error: "Failed to prepare simulation input." });
        }

        const command = `"${EXECUTABLE_PATH}" "${tempInputPath}" "${outputPath}"`;

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(
                    "Simulation execution error:",
                    stderr || err.message
                );
                return res
                    .status(500)
                    .json({ error: "Simulation execution failed." });
            }

            return res.json({ fileName });
        });
    } catch (error) {
        console.error("Unexpected server error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
