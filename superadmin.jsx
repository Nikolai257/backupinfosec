import React, { useState, useEffect } from "react";

export default function SuperAdmin() {
  const [admins, setAdmins] = useState([]);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Fetch admins from PHP/MySQL
  useEffect(() => {
    fetch("http://localhost/infosec/superadmin.php?action=fetch")
      .then((res) => res.json())
      .then((data) => setAdmins(data))
      .catch((err) => console.error("Error fetching admins:", err));
  }, []);

  const addAdmin = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", newUsername);
    formData.append("email", newEmail);

    fetch("http://localhost/infosec/superadmin.php?action=add", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Refresh admin list
          setAdmins((prev) => [
            ...prev,
            { id: prev.length + 1, username: newUsername, email: newEmail, role: "admin" },
          ]);
          setNewUsername("");
          setNewEmail("");
        } else {
          alert("Error adding admin: " + data.error);
        }
      })
      .catch((err) => console.error("Error adding admin:", err));
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-4">Super Admin Dashboard</h2>

      {/* Add Admin Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Add New Admin</h5>
          <form onSubmit={addAdmin} className="row g-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button type="submit" className="btn btn-dark">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Admin Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id}>
                <td>{index + 1}</td>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td>
                  <span
                    className={`badge ${
                      admin.role === "superadmin" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {admin.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
