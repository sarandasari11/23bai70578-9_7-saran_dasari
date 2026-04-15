import React, { useState } from "react";
import { Alert, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { buildBasicAuthHeader, normalizeRole, saveSession } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      const role = normalizeRole(response.data.role);
      const authHeader = buildBasicAuthHeader(username, password);

      saveSession({
        username: response.data.username,
        role,
        authHeader,
      });

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell d-flex align-items-center justify-content-center p-3">
      <div className="container" style={{ maxWidth: 520 }}>
        <Card className="card-shadow border-0">
          <CardContent className="p-4 p-md-5">
            <Typography variant="h4" className="fw-bold mb-2 text-center">
              RBAC Login
            </Typography>
            <p className="text-muted text-center mb-4">
              Sign in with your Experiment 7 credentials.
            </p>

            {error && <Alert severity="error" className="mb-3">{error}</Alert>}

            <form onSubmit={login}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                className="mb-3"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                className="mb-4"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>

            <div className="mt-4 p-3 rounded bg-light border">
              <h6 className="fw-bold mb-2">Demo Accounts</h6>
              <p className="mb-1"><strong>USER:</strong> user1 / user123</p>
              <p className="mb-0"><strong>ADMIN:</strong> admin1 / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}