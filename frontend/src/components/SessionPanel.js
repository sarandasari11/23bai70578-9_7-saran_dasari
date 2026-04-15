import React from "react";
import { getAuthHeader, getCurrentRole, getCurrentUser } from "../utils/auth";

export default function SessionPanel() {
  const authHeader = getAuthHeader();

  return (
    <div className="card card-shadow border-0">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Session Storage Snapshot</h6>
        <div className="stat-box p-3">
          <p className="mb-2">
            <strong>username:</strong> {getCurrentUser() || "-"}
          </p>
          <p className="mb-2">
            <strong>role:</strong> {getCurrentRole() || "-"}
          </p>
          <p className="mb-0">
            <strong>authHeader:</strong> {authHeader ? `${authHeader.slice(0, 20)}...` : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}