import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoveApp from "./LoveApp";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/temp" element={<LoveApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
