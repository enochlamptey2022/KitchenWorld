import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function PaymentCallback({ clearCart }) {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [status, setStatus] =
    useState("Verifying payment...");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const reference =
          searchParams.get("reference") ||
          searchParams.get("trxref");

        if (!reference) {
          throw new Error(
            "Payment reference not found."
          );
        }

        const response = await fetch(
          `http://localhost:5000/api/payments/verify/${reference}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Payment verification failed"
          );
        }

        clearCart();

        localStorage.removeItem(
          "pendingOrderId"
        );

        setStatus(
          "Payment successful!"
        );

      } catch (error) {
        console.error(error);

        setError(error.message);
      }
    };

    verifyPayment();

  }, [
    searchParams,
    navigate,
    clearCart,
  ]);


  if (error) {
    return (
      <main className="payment-callback-page">

        <div className="payment-callback-card">

          <h1>
            Payment Verification Failed
          </h1>

          <p>
            {error}
          </p>

          <Link to="/account">
            View My Orders
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="payment-callback-page">

      <div className="payment-callback-card">

        <h1>
          {status}
        </h1>

        {status ===
          "Payment successful!" && (
          <>
            <p>
              Your payment has been
              confirmed and your order
              has been received.
            </p>

            <Link to="/account">
              View My Orders
            </Link>

            <br />

            <Link to="/shop">
              Continue Shopping
            </Link>
          </>
        )}

      </div>

    </main>
  );
}

export default PaymentCallback;