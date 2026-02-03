import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMPORARY SUPERADMIN CREDENTIALS
    const superEmail = "admin@uniko.com";
    const superPass = "admin123";

    if (email === superEmail && password === superPass) {
      navigate("/superadmin"); // redirect to superadmin dashboard
    } else {
      setError("Invalid superadmin credentials.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3 fw-bold">Superadmin Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Superadmin Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter superadmin email"
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

        {/* Back to Admin Login */}
        <button
          className="btn btn-link w-100 mt-3"
          onClick={() => navigate("/adminlogin")}
        >
          Back to Admin Login
        </button>
      </div>
    </div>
  );
}
