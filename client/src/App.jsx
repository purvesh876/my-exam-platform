import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import TestCreation from "./pages/TestCreation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tests" element={<TestCreation />} />
      </Routes>
    </BrowserRouter>
  );
}
