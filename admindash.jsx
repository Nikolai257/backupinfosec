// src/admindash.jsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Search, Plus, Edit2, Trash2, X, Users, Briefcase, DollarSign, TrendingUp, ShoppingCart
} from 'lucide-react';

// Utils
const getStoredData = (key, defaultData) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultData;
};

const getClients = () => {
  const users = getStoredData('users', []);
  return users.map((user, index) => ({
    id: index + 1,
    name: user.username,
    email: user.email || `${user.username}@email.com`,
    phone: user.phone || 'N/A',
    createdAt: new Date().toISOString().split('T')[0]
  }));
};

const getOrders = () => {
  return getStoredData('orders', [
    { id: 1, client: "Juan Dela Amin", items: "Shirt x2, Cap x1", total: 1597, status: "pending", date: "Nov 23, 2025", employee: "Employee A" },
    { id: 2, client: "Maria Gando", items: "", total: 1299, status: "completed", date: "Nov 23, 2025", employee: "Employee B" },
    { id: 3, client: "Pedro Andrei", items: "Sneakers x1, Shirt x1", total: 3098, status: "pending", date: "Nov 22, 2025", employee: "Employee A" }
  ]);
};

const initialEmployeesData = [
  { id: 1, name: 'Employee A', role: 'Manager', email: 'empa@uniko.com', phone: '0921-111-2222', createdAt: '2023-11-10' },
  { id: 2, name: 'Employee B', role: 'Sales Associate', email: 'empb@uniko.com', phone: '0922-222-3333', createdAt: '2023-12-15' },
  { id: 3, name: 'Employee C', role: 'Inventory Clerk', email: 'empc@uniko.com', phone: '0923-333-4444', createdAt: '2024-01-20' },
];

const monthlyData = [
  { month: 'Jun', clients: 85, employees: 12, revenue: 45000, transactions: 120 },
  { month: 'Jul', clients: 92, employees: 13, revenue: 52000, transactions: 145 },
  { month: 'Aug', clients: 105, employees: 14, revenue: 58000, transactions: 168 },
  { month: 'Sep', clients: 112, employees: 14, revenue: 61000, transactions: 182 },
  { month: 'Oct', clients: 118, employees: 15, revenue: 68000, transactions: 201 },
  { month: 'Nov', clients: 120, employees: 15, revenue: 72000, transactions: 215 },
];

// CRUD Table Component (reusable)
const CRUDTable = ({ data, setData, columns, entityName, storageKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const itemsPerPage = 5;

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, storageKey]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setData(prevData => {
      const nextId = (prevData && prevData.length) ? Math.max(...prevData.map(d => d.id || 0)) + 1 : 1;
      const newItem = {
        ...formData,
        id: nextId,
        // Preserve createdAt if provided, else set now
        createdAt: formData.createdAt || new Date().toISOString().split('T')[0],
      };
      return [...prevData, newItem];
    });
    closeModal();
  };

  const handleEdit = () => {
    setData(data.map(item =>
      item.id === editingItem.id
        ? { ...formData, id: editingItem.id, createdAt: editingItem.createdAt }
        : item
    ));
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  return (
    <div className="bg-white rounded shadow-lg p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">{entityName}</h2>
        <button onClick={() => openModal()} className="btn btn-danger d-flex align-items-center gap-2">
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="mb-3 position-relative">
        <Search className="position-absolute" style={{ left: '12px', top: '12px', color: '#6c757d' }} size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="form-control ps-5"
        />
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-muted py-4">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map(item => (
                <tr key={item.id}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.key === 'amount' || col.key === 'total' || col.key === 'price'
                        ? `₱${(item[col.key] ?? 0).toLocaleString()}`
                        : item[col.key] || 'N/A'}
                    </td>
                  ))}
                  <td className="text-end">
                    <button onClick={() => openModal(item)} className="btn btn-sm btn-outline-danger me-2">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-dark">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-sm ${currentPage === page ? 'btn-danger' : 'btn-outline-secondary'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {isModalOpen && (
        <>
          <div className="modal-backdrop show" onClick={closeModal} style={{ zIndex: 1040 }}></div>
          <div className="modal show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingItem ? 'Edit' : 'Add'} {entityName}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  {columns.filter(col => col.key !== 'id' && col.key !== 'createdAt').map(col => (
                    <div key={col.key} className="mb-3">
                      <label className="form-label">{col.label}</label>
                      {col.key === 'status' ? (
                        <select
                          value={formData[col.key] || ''}
                          onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                          className="form-control"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <input
                          type={
                            col.key === 'amount' || col.key === 'total' || col.key === 'price'
                              ? 'number'
                              : col.key === 'email'
                                ? 'email'
                                : col.key === 'date'
                                  ? 'date'
                                  : 'text'
                          }
                          value={formData[col.key] || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            [col.key]:
                              (col.key === 'amount' || col.key === 'total' || col.key === 'price')
                                ? parseFloat(e.target.value) || 0
                                : e.target.value
                          })}
                          className="form-control"
                          required
                        />
                      )}
                      {col.key === 'img' && (
                        <div className="form-text">
                          Example: /image3.png (place files in public/)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={editingItem ? handleEdit : handleAdd}>
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [clientsData, setClientsData] = useState(() => getClients());
  const [employeesData, setEmployeesData] = useState(() =>
    getStoredData('adminEmployees', initialEmployeesData)
  );
  const [ordersData, setOrdersData] = useState(() => getOrders());

  // NEW: Products state
  const [productsData, setProductsData] = useState(() =>
    getStoredData('products', [
      { id: 1, name: 'Shirt', img: '/image1.jpeg', price: 499, createdAt: new Date().toISOString().split('T')[0] },
      { id: 2, name: 'Jeans', img: '/image2.png', price: 1299, createdAt: new Date().toISOString().split('T')[0] },
    ])
  );

  // Refresh clients when view changes
  useEffect(() => {
    if (currentView === 'clients') {
      const newClients = getClients();
      const isDifferent =
        newClients.length !== clientsData.length ||
        newClients.some((c, i) =>
          c.name !== clientsData[i]?.name ||
          c.email !== clientsData[i]?.email ||
          c.phone !== clientsData[i]?.phone
        );

      if (isDifferent) {
        const id = setTimeout(() => setClientsData(newClients), 0);
        return () => clearTimeout(id);
      }
    }
  }, [currentView, clientsData]);

  const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (currentView) {
      case 'clients':
        return (
          <CRUDTable
            data={clientsData}
            setData={setClientsData}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Username' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'createdAt', label: 'Registered' },
            ]}
            entityName="Clients"
            storageKey="users"
          />
        );
      case 'employees':
        return (
          <CRUDTable
            data={employeesData}
            setData={setEmployeesData}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'createdAt', label: 'Hired Date' },
            ]}
            entityName="Employees"
            storageKey="adminEmployees"
          />
        );
      case 'orders':
        return (
          <CRUDTable
            data={ordersData}
            setData={setOrdersData}
            columns={[
              { key: 'id', label: 'Order ID' },
              { key: 'client', label: 'Client Name' },
              { key: 'items', label: 'Items' },
              { key: 'total', label: 'Total' },
              { key: 'date', label: 'Date' },
              { key: 'status', label: 'Status' },
              { key: 'employee', label: 'Handled By' },
            ]}
            entityName="Orders"
            storageKey="orders"
          />
        );
      case 'products':
        return (
          <CRUDTable
            data={productsData}
            setData={setProductsData}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Clothing Type' },
              { key: 'img', label: 'Image Path' },
              { key: 'price', label: 'Price' },
              { key: 'createdAt', label: 'Added On' },
            ]}
            entityName="Products"
            storageKey="products"
          />
        );
      default:
        return (
          <>
            {/* KPI Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card bg-danger bg-gradient text-white shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-1 opacity-75">Total Clients</p>
                        <h2 className="fw-bold mb-0">{clientsData.length}</h2>
                      </div>
                      <Users size={40} className="opacity-75" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card bg-dark text-white shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-1 opacity-75">Total Employees</p>
                        <h2 className="fw-bold mb-0">{employeesData.length}</h2>
                      </div>
                      <Briefcase size={40} className="opacity-75" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card bg-danger bg-gradient text-white shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-1 opacity-75">Total Orders</p>
                        <h2 className="fw-bold mb-0">{ordersData.length}</h2>
                      </div>
                      <ShoppingCart size={40} className="opacity-75" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card bg-dark text-white shadow">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-1 opacity-75">Total Revenue</p>
                        <h2 className="fw-bold mb-0">₱{totalRevenue.toLocaleString()}</h2>
                      </div>
                      <div className="opacity-75" style={{ fontSize: '40px', fontWeight: 'bold' }}>₱</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card shadow">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-4">Monthly Growth Trends</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="clients" stroke="#dc3545" strokeWidth={2} name="Clients" />
                        <Line type="monotone" dataKey="employees" stroke="#212529" strokeWidth={2} name="Employees" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card shadow">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-4">Revenue Trends</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#dc3545" name="Revenue (₱)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-dark text-white shadow" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-4 border-bottom border-secondary">
          <h2 className="fw-bold mb-0">ADMIN</h2>
          <p className="text-muted small mb-0">Management Portal</p>
        </div>
        <nav className="mt-3">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'clients', label: 'Manage Clients', icon: Users },
            { id: 'employees', label: 'Manage Employees', icon: Briefcase },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'products', label: 'Manage Products', icon: DollarSign }, // NEW
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-100 text-start text-white border-0 p-3 d-flex align-items-center gap-3 ${currentView === item.id ? 'bg-danger' : 'bg-dark'}`}
                style={{ transition: 'all 0.2s' }}
                onMouseEnter={(e) => { if (currentView !== item.id) e.target.style.backgroundColor = '#495057'; }}
                onMouseLeave={(e) => { if (currentView !== item.id) e.target.style.backgroundColor = ''; }}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-100 text-start text-white border-0 p-3 d-flex align-items-center gap-3 bg-dark mt-3 border-top border-secondary"
            style={{ transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#495057'}
            onMouseLeave={(e) => e.target.style.backgroundColor = ''}
          >
            <X size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="mb-4">
          <h1 className="fw-bold">
            {currentView === 'dashboard' ? 'Admin Dashboard' :
              currentView === 'clients' ? 'Client Management' :
                currentView === 'employees' ? 'Employee Management' :
                  currentView === 'orders' ? 'Order Management' :
                    'Product Management'}
          </h1>
          <p className="text-muted">
            {currentView === 'dashboard' ? 'Overview & Analytics' : 'Manage your data efficiently'}
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
