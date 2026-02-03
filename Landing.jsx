import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  // Map product names to their image files
  const products = [
  { name: "Shirt", img: "/image1.jpeg" },
  { name: "Jeans", img: "/image2.jpeg" },
  { name: "Sneakers", img: "/image3.jpeg" },
  { name: "Cap", img: "/image4.jpeg" },
];


  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <header className="w-100 bg-white shadow-sm">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center gap-2">
            <img src="/UNIKO.png" alt="UNIKO Logo" style={{ height: "40px" }} />
            <h1 className="fs-2 fw-bold text-dark mb-0">UNIKO</h1>
          </div>
          <button
            className="btn btn-dark"
            onClick={() => navigate("/login")}
          >
            Shop Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow-1 d-flex align-items-center justify-content-center bg-light text-center">
        <div>
          <h2 className="fw-bold display-4">Elevate Your Style with UNIKO</h2>
          <p className="lead text-muted mt-3">
            Unique. Never seen before. Incredible. Klassy. Outstanding
          </p>
          <button
            className="btn btn-dark btn-lg mt-4"
            onClick={() => navigate("/login")}
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="container-fluid px-4 py-5">
        <h3 className="text-center fw-bold mb-4">Featured Products</h3>
        <div className="row gx-4 gy-4">
          {products.map((item, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-md-3">
              <div className="card shadow-sm h-100">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "200px", overflow: "hidden" }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <div className="card-body text-center">
                  <h4 className="card-title">{item.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto w-100">
  <small>
    © 2025 UNIKO. All rights reserved. &nbsp; | &nbsp;
    <span
      onClick={() => navigate("/adminlogin")}
      style={{ cursor: "pointer", textDecoration: "underline" }}
    >
      Admin
    </span>
  </small>
</footer>
    </div>
  );
};

export default Landing;
