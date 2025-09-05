import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/Home.page";
import SimulatePage from "./pages/Simulate.page";
import AnalyzePage from "./pages/Analyze.page";
import LearnPage from "./pages/Learn.page";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/simulate" element={<SimulatePage />} />
                    <Route path="/analyze" element={<AnalyzePage />} />
                    <Route path="/learn" element={<LearnPage />} />
                    <Route path="*" element={<>Not Found</>} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </>
    );
};

export default App;
