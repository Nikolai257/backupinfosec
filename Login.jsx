import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost/react-api/login.php";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          // No role sent – backend fetches it from DB
        }),
      });

      const data = await response.json();
      
console.log("=== LOGIN DEBUG ===");
    console.log("Full response:", data);
    console.log("Role from backend:", data.role);
    console.log("Role type:", typeof data.role);
    console.log("Is employee?", data.role === "employee");
    console.log("Comparison:", `'${data.role}' === 'employee'`);
    console.log("==================");
    // ======================================

 if (data.success) {
  // Handle both response formats
const role = (data.role || data.user?.role || "").trim().toLowerCase();

  const username = data.username || data.user?.username;
  
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("userRole", role);
  localStorage.setItem("username", username);

  console.log("Stored role:", role);

  // Redirect based on role
  if (role === "employee") {
    console.log("✅ Navigating to /employee");
    navigate("/employee");
  } else {
    console.log("❌ Navigating to /app");
    navigate("/app");
  }
} else {
      alert(data.message);
    }
  } catch (error) {
    alert("Connection error. Make sure XAMPP is running.");
    console.error("Login error:", error);
  } finally {
    setLoading(false);
  }
};  
  return (
    <div className="min-vh-100 d-flex position-relative">
      {/* Back Button */}
      <Link
        to="/"
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

      {/* Right Side – Login Form */}
      <div className="w-50 d-flex align-items-center justify-content-center bg-white shadow">
        <form className="w-75" onSubmit={handleLogin}>
          <h2 className="mb-4 fw-bold text-center">Login to UNIKO</h2>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-dark w-100 mb-3" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link to="/register" className="btn btn-outline-secondary w-100">
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;