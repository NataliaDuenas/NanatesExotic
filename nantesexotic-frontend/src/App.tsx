import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalContextProviders } from "./GlobalContextProviders";

import LandingPage from "./pages/Home";
import DiagnosticPage from "./pages/diagnostic";
import ResultatsPage from "./pages/resultats";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalContextProviders>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/resultats" element={<ResultatsPage />} />
        </Routes>
      </GlobalContextProviders>
    </BrowserRouter>
  );
}