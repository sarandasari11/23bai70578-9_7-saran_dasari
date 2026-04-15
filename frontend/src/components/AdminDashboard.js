import React, { useState } from "react";
import { Alert, Button } from "@mui/material";
import api from "../utils/api";
import SessionPanel from "./SessionPanel";
import TopBar from "./TopBar";

export default function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAdminData = async () => {
    setError("");
    try {
      const response = await api.get("/admin/dashboard");
      setMessage(response.data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to fetch admin dashboard");
    }
  };

  const fetchUserProfile = async () => {
    setError("");
    try {
      const response = await api.get("/user/profile");
      setMessage(response.data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to fetch user profile");
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <TopBar />

      <div className="card card-shadow border-0 mb-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-2">Admin Dashboard</h4>
          <p className="text-muted mb-4">As ADMIN, you can access both user and admin APIs.</p>

          <div className="d-flex flex-wrap gap-3 mb-4">
            <Button variant="contained" color="error" onClick={fetchAdminData}>
              Get /api/admin/dashboard
            </Button>
            <Button variant="outlined" color="primary" onClick={fetchUserProfile}>
              Get /api/user/profile
            </Button>
          </div>

          {message && <Alert severity="success" className="mb-3">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </div>
      </div>

      <SessionPanel />
    </div>
  );
}