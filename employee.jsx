import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const Employee = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      client: "Juan Dela Amin",
      items: "Shirt x2, Cap x1",
      total: 1597,
      status: "pending",
      date: "Nov 23, 2025"
    },
    {
      id: 2,
      client: "Maria Gando",
      total: 1299,
      status: "completed",
      date: "Nov 23, 2025"
    },
    {
      id: 3,
      client: "Pedro Andrei",
      items: "Sneakers x1, Shirt x1",
      total: 3098,
      status: "pending",
      date: "Nov 22, 2025"
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "warning";
    if (status === "completed") return "success";
    return "danger";
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <img src="/UNIKO.png" alt="UNIKO" style={{ height: "40px" }} />
            <h2 className="mb-0">UNIKO</h2>
            <span className="badge bg-dark">Employee</span>
          </div>
          <button className="btn btn-dark" onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}>Logout</button>
        </div>
      </header>

      {/* Stats */}
      <div className="container py-4">
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h3>{orders.length}</h3>
                <p className="text-muted mb-0">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-warning">{orders.filter(o => o.status === "pending").length}</h3>
                <p className="text-muted mb-0">Pending</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-success">{orders.filter(o => o.status === "completed").length}</h3>
                <p className="text-muted mb-0">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Client Orders</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.client}</td>
                      <td>{order.items}</td>
                      <td>₱{order.total}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedOrder(order)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 1040 }} onClick={() => setSelectedOrder(null)}></div>
          <div className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow p-4" style={{ zIndex: 1050, width: "90%", maxWidth: "500px" }}>
            <div className="d-flex justify-content-between mb-3">
              <h4>Order #{selectedOrder.id}</h4>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}></button>
            </div>
            <p><strong>Client:</strong> {selectedOrder.client}</p>
            <p><strong>Items:</strong> {selectedOrder.items}</p>
            <p><strong>Total:</strong> ₱{selectedOrder.total}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p><strong>Status:</strong> <span className={`badge bg-${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status.toUpperCase()}</span></p>
            
            {selectedOrder.status === "pending" && (
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-success flex-fill" onClick={() => updateStatus(selectedOrder.id, "completed")}>
                  <CheckCircle size={16} /> Complete
                </button>
                <button className="btn btn-danger flex-fill" onClick={() => updateStatus(selectedOrder.id, "cancelled")}>
                  <XCircle size={16} /> Cancel
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Employee;