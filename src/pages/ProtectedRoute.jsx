import { useNavigate } from "react-router-dom";
import { UseAuth } from "../context/FakeAuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = UseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [navigate, isAuthenticated]);

  return isAuthenticated ? children : null;
}
