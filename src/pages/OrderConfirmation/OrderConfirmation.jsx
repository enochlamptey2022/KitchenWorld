import { Link } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  return (
    <main className="confirmation-page">
      <div className="confirmation-card">

        <div className="confirmation-icon">
          ✓
        </div>

        <h1>
          Thank You for Your Order!
        </h1>

        <p>
          Your order has been received
          successfully.
        </p>

        <p className="confirmation-note">
          You will receive an order
          confirmation once your order is
          processed.
        </p>

        <div className="confirmation-actions">

          <Link
            to="/shop"
            className="confirmation-primary"
          >
            Continue Shopping
          </Link>

          <Link
            to="/account"
            className="confirmation-secondary"
          >
            View Account
          </Link>

        </div>

      </div>
    </main>
  );
}

export default OrderConfirmation;