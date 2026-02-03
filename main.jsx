import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import Login from "./Login";
import Landing from "./Landing";
import Register from "./Register";
import Employee from "./employee";
import AdminLogin from "./adminlogin";
import AdminDash from "./admindash";
import SuperAdminLogin from "./superadminlogin";
import SuperAdmin from "./superadmin";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/app" element={<App />} />
  <Route path="/employee" element={<Employee />} />
  <Route path="/adminlogin" element={<AdminLogin />} />
  <Route path="/admindash" element={<AdminDash />} /> 
  <Route path="/superadminlogin" element={<SuperAdminLogin />} /> 
  <Route path="/superadmin" element={<SuperAdmin />} /> 
  
</Routes>
    </BrowserRouter>
  </StrictMode>
);
