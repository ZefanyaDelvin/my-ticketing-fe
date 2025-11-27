import { Navigate } from "react-router-dom";

const AuthMiddleware = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      return <Navigate to="/login" />;
    }
  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthMiddleware;
