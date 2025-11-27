import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AuthMiddleware from "./routes";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/*" element={<Login />} />

        {/* Private Route */}
        <Route
          path="/dashboard"
          element={
            <AuthMiddleware>
              <Dashboard />
            </AuthMiddleware>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
