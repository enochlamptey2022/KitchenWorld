import "./ProductCard.css";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="product-card">

      <label className="compare-option">
        <input type="checkbox" />
        <span>Compare products</span>
      </label>


     <Link
  to={`/product/${product.id}`}
  className="product-image-link"
>
  <div className="product-image-container">
    <img
      src={product.image}
      alt={product.name}
      className="product-image"
    />
  </div>
</Link>

      <div className="product-info">
<Link
  to={`/product/${product.id}`}
  className="product-name-link"
>
  <h3 className="product-name">
    {product.name}
  </h3>
</Link>

        <div className="product-rating">
          ★ {product.rating}
        </div>

        <p className="product-price">
          GH₵{product.price.toFixed(2)}
        </p>

        <button className="product-button">
          Add to cart
        </button>

      </div>

    </div>
  );
}

export default ProductCard;