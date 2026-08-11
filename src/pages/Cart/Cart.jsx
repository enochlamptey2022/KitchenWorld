import { Link } from "react-router-dom";
import "./Cart.css";

function Cart({
  cart,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
}) {
  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <div className="cart-container">
        <h1>Your Basket</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>Your basket is empty</h2>

            <p>
              Add some kitchenware products to get started.
            </p>

            <Link
              to="/shop"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </Link>

                  <div className="cart-item-info">
                    <Link
                      to={`/product/${item.id}`}
                      className="cart-product-link"
                    >
                      <h3>{item.name}</h3>
                    </Link>

                    <p className="cart-unit-price">
                      GH₵{item.price.toFixed(2)} each
                    </p>

                    <div className="cart-quantity-area">
                      <span>Quantity</span>

                      <div className="cart-quantity-selector">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseCartQuantity(item.id)
                          }
                          disabled={item.quantity === 1}
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseCartQuantity(item.id)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      Remove
                    </button>
                  </div>

                  <strong className="cart-item-total">
                    GH₵
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="cart-bottom">
              <Link
                to="/shop"
                className="continue-shopping-link"
              >
                ← Continue Shopping
              </Link>

              <div className="cart-summary">
                <h2>Order Summary</h2>

                <div className="summary-row">
                  <span>Subtotal</span>

                  <strong>
                    GH₵{subtotal.toFixed(2)}
                  </strong>
                </div>

                <p className="delivery-note">
                  Delivery costs will be calculated at
                  checkout.
                </p>

               <Link
  to="/checkout"
  className="checkout-button checkout-link"
>
  Proceed to Checkout
</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Cart;