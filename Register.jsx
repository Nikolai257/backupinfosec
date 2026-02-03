import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Register = () => {
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Pre-select role from Login's state, fallback to ""
  const [role, setRole] = useState(location.state?.role || "");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost/react-api/index.php";

  const handleRegister = async (e) => {
    e.preventDefault();

    // ─── EMPTY CHECK ──────────────────────────────────────────
    if (!username || !role || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    // ─── USERNAME VALIDATION ──────────────────────────────────
    if (username.length > 100) {
      alert("Username must not exceed 100 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert("Username can only contain letters, numbers, and underscores.");
      return;
    }

    // ─── PASSWORD VALIDATION ──────────────────────────────────
    if (password.length < 8 || password.length > 12) {
      alert("Password must be between 8 and 12 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // ─── SEND TO BACKEND ──────────────────────────────────────
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          role: role,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Connection error. Make sure XAMPP is running.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex position-relative">
      {/* Back Button – passes role back to Login */}
      <Link
        to="/login"
        state={{ role: role }}
        className="position-absolute top-0 start-0 m-4 btn btn-outline-dark d-flex align-items-center"
        style={{ zIndex: 10 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="me-2"
          viewBox="0 0 16 16"
        >
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
        </svg>
        Back
      </Link>

      {/* Left Side – Logo */}
      <div className="w-50 d-flex align-items-center justify-content-center bg-light">
        <img
          src="/UNIKO.png"
          alt="UNIKO Logo"
          style={{ maxWidth: "80%", maxHeight: "80%" }}
        />
      </div>

      {/* Right Side – Register Form */}
      <div className="w-50 d-flex align-items-center justify-content-center bg-white shadow">
        <form className="w-75" onSubmit={handleRegister}>
          <h2 className="mb-4 fw-bold text-center">Create Account</h2>

          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={100}
              disabled={loading}
            />
            <div className="form-text text-muted" style={{ fontSize: "0.78rem" }}>
              Letters, numbers, and underscores only. Max 100 characters.
            </div>
          </div>

          {/* Role */}
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="" disabled>Select a role</option>
              <option value="client">Client</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <div className="form-text text-muted" style={{ fontSize: "0.78rem" }}>
              Must be 8–12 characters.
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-dark w-100 mb-3" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Login Link – passes role back */}
          <div className="text-center">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" state={{ role: role }} className="text-dark fw-bold text-decoration-none">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;