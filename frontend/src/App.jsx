import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import Attack from "./pages/Attack.jsx";
import SystemEvaluation from "./pages/SystemEvaluation.jsx";
import Inject from "./pages/Inject.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/attack" element={<Attack />} />
      <Route path="/system-evaluation" element={<SystemEvaluation />} />
      <Route path="/inject" element={<Inject />} />
    </Routes>
  );
}
