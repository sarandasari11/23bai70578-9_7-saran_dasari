import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import {
  canAccessAdmin,
  canAccessUser,
  getCurrentRole,
  isAuthenticated,
  normalizeRole,
} from "./utils/auth";

function AuthRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function UserRoute({ children }) {
  if (!canAccessUser()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  if (!canAccessAdmin()) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}

function RoleRedirect() {
  const role = normalizeRole(getCurrentRole());

  if (role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "USER") {
    return <Navigate to="/user" replace />;
  }

  return <Navigate to="/" replace />;
}

function ForbiddenView() {
  return (
    <div className="container py-5">
      <div className="alert alert-danger">
        <h4 className="alert-heading">Access denied</h4>
        <p className="mb-0">You do not have permission to open this page.</p>
      </div>
      <a href="/" className="btn btn-outline-primary mt-3">
        Back to Login
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <AuthRoute>
              <RoleRedirect />
            </AuthRoute>
          }
        />
        <Route
          path="/user"
          element={
            <AuthRoute>
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            </AuthRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </AuthRoute>
          }
        />
        <Route path="/forbidden" element={<ForbiddenView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}