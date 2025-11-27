import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AuthMiddleware from "./routes";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Private Route */}
        <Route
          path="/dashboard"
          element={
            <AuthMiddleware>
              <Dashboard />
            </AuthMiddleware>
          }
        />

        {/* If route doesn't exist → redirect */}
        <Route path="/*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
