import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMPORARY ADMIN CREDENTIALS
    const adminEmail = "admin@uniko.com";
    const adminPass = "admin123";

    if (email === adminEmail && password === adminPass) {
      navigate("/admindash");
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3 fw-bold">Admin Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-danger text-center">{error}</p>}

          <button type="submit" className="btn btn-dark w-100 mt-2">
            Login
          </button>
        </form>

        {/* Superadmin Login Button */}
        <button
          className="btn btn-link w-100 mt-3 text-decoration-none"
          onClick={() => navigate("/superadminlogin")}
        >
          Superadmin Login
        </button>
      </div>
    </div>
  );
}
