import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { clearSession, getCurrentRole, getCurrentUser } from "../utils/auth";

export default function TopBar() {
  const navigate = useNavigate();
  const role = getCurrentRole();
  const username = getCurrentUser();

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h2 className="mb-1">Experiment 7 RBAC Frontend</h2>
        <p className="text-muted mb-0">
          Signed in as <strong>{username}</strong>
        </p>
      </div>

      <div className="d-flex align-items-center gap-3">
        <span className={`role-chip ${role === "ADMIN" ? "admin" : "user"}`}>{role}</span>
        <Button variant="outlined" color="error" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}