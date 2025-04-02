import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/Homepage";
import Loginpage from "./components/Login";
import CoursesPage from "./components/CoursesPage";
import { AuthProvider } from './context/AuthContext';
import Signup from "./components/Signup";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/coursepage" element={<CoursesPage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
