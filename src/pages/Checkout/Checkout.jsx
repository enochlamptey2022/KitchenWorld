import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./Checkout.css";

function Checkout({
  cart,
  clearCart,
}) {
  const navigate = useNavigate();

  const [deliveryOption, setDeliveryOption] =
    useState("standard");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const deliveryFee =
    deliveryOption === "express"
      ? 40
      : 20;

  const total =
    subtotal + deliveryFee;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Convert cart to backend format
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // =====================================
      // STEP 1: CREATE ORDER
      // =====================================

      const orderResponse = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items,
            deliveryMethod: deliveryOption,
            deliveryFee,

            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            region: formData.region,
          }),
        }
      );

      const orderData =
        await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message ||
          "Unable to create order"
        );
      }

      const orderId =
        orderData.order.id;

      // Save order ID temporarily
      localStorage.setItem(
        "pendingOrderId",
        orderId
      );

      // =====================================
      // STEP 2: INITIALIZE PAYSTACK PAYMENT
      // =====================================

      const paymentResponse = await fetch(
        "http://localhost:5000/api/payments/initialize",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            orderId,
          }),
        }
      );

      const paymentData =
        await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
          "Unable to initialize payment"
        );
      }

      // =====================================
      // STEP 3: REDIRECT TO PAYSTACK
      // =====================================

      window.location.href =
        paymentData.authorizationUrl;

    } catch (error) {
      console.error(error);

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <h1>
            Your basket is empty
          </h1>

          <p>
            Add products before
            proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="checkout-shop-link"
          >
            Go to Shop
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-main">

          <h1>
            Checkout
          </h1>

          {error && (
            <p className="checkout-error">
              {error}
            </p>
          )}

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >

            {/* SHIPPING INFORMATION */}
            <section className="checkout-section">

              <h2>
                Shipping Information
              </h2>

              <div className="form-grid">

                <div className="form-group full-width">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="form-group full-width">

                  <label>
                    Delivery Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Region
                  </label>

                  <input
                    type="text"
                    name="region"
                    value={
                      formData.region
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

            </section>


            {/* DELIVERY METHOD */}
            <section className="checkout-section">

              <h2>
                Delivery Method
              </h2>

              <label className="delivery-option">

                <input
                  type="radio"
                  value="standard"
                  checked={
                    deliveryOption ===
                    "standard"
                  }
                  onChange={(event) =>
                    setDeliveryOption(
                      event.target.value
                    )
                  }
                />

                <div>

                  <strong>
                    Standard Delivery
                  </strong>

                  <span>
                    GH₵20 — 3–5
                    working days
                  </span>

                </div>

              </label>


              <label className="delivery-option">

                <input
                  type="radio"
                  value="express"
                  checked={
                    deliveryOption ===
                    "express"
                  }
                  onChange={(event) =>
                    setDeliveryOption(
                      event.target.value
                    )
                  }
                />

                <div>

                  <strong>
                    Express Delivery
                  </strong>

                  <span>
                    GH₵40 — 1–2
                    working days
                  </span>

                </div>

              </label>

            </section>


            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >
              {loading
                ? "Preparing Payment..."
                : `Pay GH₵${total.toFixed(2)}`}
            </button>

          </form>

        </div>


        {/* ORDER SUMMARY */}
        <aside className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          {cart.map((item) => (

            <div
              className="checkout-item"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="checkout-item-info">

                <h3>
                  {item.name}
                </h3>

                <p>
                  Quantity:{" "}
                  {item.quantity}
                </p>

              </div>

              <strong>
                GH₵
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}
              </strong>

            </div>

          ))}


          <div className="checkout-summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              GH₵
              {subtotal.toFixed(2)}
            </strong>

          </div>


          <div className="checkout-summary-row">

            <span>
              Delivery
            </span>

            <strong>
              GH₵
              {deliveryFee.toFixed(2)}
            </strong>

          </div>


          <div className="checkout-summary-row total-row">

            <span>
              Total
            </span>

            <strong>
              GH₵
              {total.toFixed(2)}
            </strong>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;