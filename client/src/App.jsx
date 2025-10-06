// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AdminDashboard from "./pages/AdminDashboard";
// import TestCreation from "./pages/TestCreation";
// import TestPage from "./pages/TestPage";



// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
        
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/admin/tests" element={<TestCreation />} />
//          <Route path="/admin/" element={<AdminDashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import TestCreation from "./pages/TestCreation";
import Login from "./pages/login";
import StudentDashboard from "./pages/StudentDashboard";
import TestPage from "./pages/TestPage";
import { AuthProvider } from "./context/AuthContext";
import AdminQuestions from "./pages/AdminQuestions";
import AdminResults from "./pages/AdminResults";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tests" element={<TestCreation />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/results" element={<AdminResults />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

