import React, { useState } from "react";
import { Alert, Button } from "@mui/material";
import api from "../utils/api";
import { canAccessAdmin, getCurrentRole } from "../utils/auth";
import SessionPanel from "./SessionPanel";
import TopBar from "./TopBar";

export default function UserDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setError("");
    try {
      const response = await api.get("/user/profile");
      setMessage(response.data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to fetch user profile");
    }
  };

  const tryAdminEndpoint = async () => {
    setMessage("");
    try {
      const response = await api.get("/admin/dashboard");
      setMessage(response.data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Access denied for admin endpoint");
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <TopBar />

      <div className="card card-shadow border-0 mb-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-2">User Dashboard</h4>
          <p className="text-muted mb-4">
            You can access user resources. Admin actions are restricted unless your role is ADMIN.
          </p>

          <div className="d-flex flex-wrap gap-3 mb-4">
            <Button variant="contained" color="success" onClick={fetchProfile}>
              Get /api/user/profile
            </Button>

            {canAccessAdmin() ? (
              <Button variant="contained" color="warning" onClick={tryAdminEndpoint}>
                Get /api/admin/dashboard
              </Button>
            ) : (
              <Button variant="outlined" color="warning" disabled>
                Admin endpoint hidden for USER
              </Button>
            )}

            {getCurrentRole() === "USER" && (
              <Button variant="outlined" color="error" onClick={tryAdminEndpoint}>
                Try admin endpoint (expect 403)
              </Button>
            )}
          </div>

          {message && <Alert severity="success" className="mb-3">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </div>
      </div>

      <SessionPanel />
    </div>
  );
}