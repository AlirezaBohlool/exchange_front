import React from "react";
import { useNavigate } from "react-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);
  return <>{children}</>;
}
