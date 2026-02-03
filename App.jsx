import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

const App = () => {
  const username = localStorage.getItem("username") || "Client User";

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("products")) || [];
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const orderData = {
        username: username,
        total: total,
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const response = await fetch('http://localhost/infosec/public/react-api/orders.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`Order placed! Order ID: ${result.order_id}\nTotal: ₱${total.toFixed(2)}\nThank you!`);
        setCart([]);
        setShowCart(false);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to place order: ' + error.message);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <header className="w-100 bg-white shadow-sm position-sticky top-0" style={{ zIndex: 1000 }}>
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center gap-2">
            <img src="/UNIKO.png" alt="UNIKO Logo" style={{ height: "40px" }} />
            <h1 className="fs-2 fw-bold text-dark mb-0">UNIKO</h1>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary d-none d-md-inline">Welcome, {username}</span>
            
            <button
              className="btn btn-outline-dark position-relative"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.length}
                </span>
              )}
            </button>

            <button 
              className="btn btn-dark"
              onClick={() => {
                localStorage.removeItem("loggedIn");
                localStorage.removeItem("userRole");
                localStorage.removeItem("username");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {showCart && (
        <div
          className="position-fixed top-0 end-0 bg-white shadow-lg h-100 overflow-auto"
          style={{ width: "400px", zIndex: 1050 }}
        >
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Shopping Cart</h3>
              <button
                className="btn-close"
                onClick={() => setShowCart(false)}
              ></button>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-secondary">Your cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex gap-3">
                        <img
                          src={item.img}
                          alt={item.name}
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          className="rounded"
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="text-muted mb-2">₱{item.price}</p>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger ms-auto"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-top pt-3 mt-4">
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong>₱{total.toFixed(2)}</strong>
                  </div>
                  <button
                    className="btn btn-dark w-100"
                    onClick={handleCheckout}
                  >
                    place order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showCart && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setShowCart(false)}
        ></div>
      )}

      <section id="products" className="container-fluid px-4 py-5">
        <h3 className="text-center fw-bold mb-4">Featured Products</h3>
        <div className="row gx-4 gy-4">
          {products.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-3">
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
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="text-primary fw-bold fs-5 mb-3">₱{item.price}</p>
                  <button
                    className="btn btn-dark mt-auto"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-3 mt-auto w-100">
        &copy; 2025 UNIKO. All rights reserved.
      </footer>
    </div>
  );
};

export default App;