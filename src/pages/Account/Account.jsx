import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";

function Account({ user, setUser }) {
  const navigate = useNavigate();

  const [accountUser, setAccountUser] = useState(user);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAccountData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Authentication failed"
          );
        }

        const formattedUser = {
          id: data.user.id,
          fullName: data.user.full_name,
          email: data.user.email,
          createdAt: data.user.created_at,
        };

        setAccountUser(formattedUser);
        setUser(formattedUser);

      } catch (error) {
        console.error(error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        navigate("/login");

      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load orders"
          );
        }

        const formattedOrders = data.map((order) => ({
          ...order,
          total_amount: Number(order.total_amount),
          delivery_fee: Number(order.delivery_fee),
        }));

        setOrders(formattedOrders);

      } catch (error) {
        console.error(error);

        setError(error.message);

      } finally {
        setOrdersLoading(false);
      }
    };

    fetchAccountData();
    fetchOrders();

  }, [navigate, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  if (loading) {
    return (
      <main className="account-page">
        <p>Loading account...</p>
      </main>
    );
  }

  if (!accountUser) {
    return null;
  }

  return (
    <main className="account-page">
      <div className="account-container">

        <div className="account-header">
          <div>
            <h1>My Account</h1>

            <p>
              Welcome, {accountUser.fullName}
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="account-grid">

          <section className="account-card">
            <h2>Profile</h2>

            <p>
              <strong>Name:</strong>{" "}
              {accountUser.fullName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {accountUser.email}
            </p>
          </section>

          <section className="account-card">
            <h2>Addresses</h2>

            <p>
              Your saved delivery addresses will appear here.
            </p>
          </section>

        </div>


        <section className="orders-section">

          <div className="orders-heading">
            <h2>My Orders</h2>

            <Link to="/shop">
              Continue Shopping
            </Link>
          </div>


          {ordersLoading && (
            <p>
              Loading orders...
            </p>
          )}


          {error && (
            <p className="orders-error">
              {error}
            </p>
          )}


          {!ordersLoading && !error && orders.length === 0 && (
            <div className="no-orders">
              <h3>No orders yet</h3>

              <p>
                You haven't placed an order yet.
              </p>

              <Link to="/shop">
                Start Shopping
              </Link>
            </div>
          )}


          {!ordersLoading && !error && orders.length > 0 && (
            <div className="orders-list">

              {orders.map((order) => (
                <div
                  className="order-card"
                  key={order.id}
                >

                  <div className="order-card-top">

                    <div>
                      <span className="order-label">
                        Order
                      </span>

                      <strong>
                        #{order.id}
                      </strong>
                    </div>


                    <span
                      className={`order-status ${order.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {order.status}
                    </span>

                  </div>


                  <div className="order-details">

                    <div>
                      <span>
                        Date
                      </span>

                      <strong>
                        {new Date(
                          order.created_at
                        ).toLocaleDateString()}
                      </strong>
                    </div>


                    <div>
                      <span>
                        Delivery
                      </span>

                      <strong>
                        {order.delivery_method}
                      </strong>
                    </div>


                    <div>
                      <span>
                        Delivery Fee
                      </span>

                      <strong>
                        GH₵
                        {order.delivery_fee.toFixed(2)}
                      </strong>
                    </div>


                    <div>
                      <span>
                        Total
                      </span>

                      <strong>
                        GH₵
                        {order.total_amount.toFixed(2)}
                      </strong>
                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default Account;