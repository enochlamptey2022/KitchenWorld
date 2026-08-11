import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./ProductDetails.css";

function ProductDetails({ addToCart }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        const formattedProduct = {
          ...data,
          price: Number(data.price),
          rating: Number(data.rating),
        };

        setProduct(formattedProduct);
        setError("");

      } catch (error) {
        console.error(error);

        setError("Unable to load product.");

      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <p>Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <h1>Product not found</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <div className="product-details-container">

        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-details-info">

          <p className="details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="details-rating">
            <span>★</span>
            <span>{product.rating}</span>
          </div>

          <p className="details-price">
            GH₵{product.price.toFixed(2)}
          </p>

          <p
            className={
              product.stock > 0
                ? "details-stock in-stock"
                : "details-stock out-of-stock"
            }
          >
            {product.stock > 0
              ? `${product.stock} items in stock`
              : "Out of stock"}
          </p>

          <p className="details-description">
            {product.description}
          </p>

          <div className="quantity-section">
            <p>Quantity</p>

            <div className="quantity-selector">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="details-cart-button"
            disabled={product.stock === 0}
            onClick={() =>
              addToCart(product, quantity)
            }
          >
            {product.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>

        </div>
      </div>
    </main>
  );
}

export default ProductDetails;