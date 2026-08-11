import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Shop.css";

import ProductCard from "../../components/ProductCard/ProductCard";
import shopHeroImage from "../../assets/kitchen2.png";
import shopHeroAltOne from "../../assets/kitchen.png";
import shopHeroAltTwo from "../../assets/hero.png";
import cookwareImage from "../../assets/Categories/cookware.jpg";

function Shop({ searchTerm }) {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [sortOption, setSortOption] = useState("Featured");

  const queryCategory =
    new URLSearchParams(location.search).get("category") || "cast iron";

  const bannerImages = [
    shopHeroImage,
    shopHeroAltOne,
    shopHeroAltTwo,
    cookwareImage,
  ];

  const formattedCategory = queryCategory
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const formattedProducts = data.map((product) => ({
          ...product,
          price: Number(product.price),
          rating: product.rating
            ? Number(product.rating)
            : 0,
        }));

        setProducts(formattedProducts);
        setError("");
      } catch (error) {
        console.error(error);

        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((previousSlide) =>
        (previousSlide + 1) % bannerImages.length
      );
    }, 3200);

    return () => clearInterval(slideInterval);
  }, [bannerImages.length]);

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    let priceMatch = true;

    if (selectedPrice === "Under 50") {
      priceMatch = product.price < 50;
    }

    if (selectedPrice === "50-100") {
      priceMatch =
        product.price >= 50 &&
        product.price <= 100;
    }

    if (selectedPrice === "100+") {
      priceMatch = product.price > 100;
    }

    const searchMatch = product.name
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase());

    return categoryMatch && priceMatch && searchMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Price: Low to High") {
      return a.price - b.price;
    }

    if (sortOption === "Price: High to Low") {
      return b.price - a.price;
    }

    if (sortOption === "Rating") {
      return b.rating - a.rating;
    }

    return 0;
  });

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedPrice("All");
    setSortOption("Featured");
  };

  if (loading) {
    return (
      <main className="shop-page">
        <p>Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shop-page">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="shop-page">
      <nav className="shop-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="shop-breadcrumb-separator">›</span>
        <span>Cookware &amp; Bakeware</span>
        <span className="shop-breadcrumb-separator">›</span>
        <span className="shop-breadcrumb-current">{formattedCategory}</span>
      </nav>

      <section className="shop-category-hero">
        <div className="shop-category-copy">
          <h1>{formattedCategory}</h1>
          <p className="shop-category-count">Category spotlight</p>
          <p className="shop-category-description">
            You can edit this text later.
          </p>
        </div>

        <div className="shop-category-visual">
          {bannerImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={formattedCategory}
              className={
                index === currentSlide
                  ? "shop-banner-image active"
                  : "shop-banner-image"
              }
            />
          ))}

          <div className="shop-banner-dots" aria-hidden="true">
            {bannerImages.map((image, index) => (
              <span
                key={`${image}-${index}`}
                className={
                  index === currentSlide
                    ? "shop-banner-dot active"
                    : "shop-banner-dot"
                }
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* TOP TOOLBAR */}
      <div className="shop-toolbar">

        <div className="toolbar-left">
          <button className="filter-button">
            Filter
          </button>

          <div className="sort-box">
            <span>Sort products by</span>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value)
              }
            >
              <option value="Featured">
                Featured
              </option>

              <option value="Price: Low to High">
                Price: Low to High
              </option>

              <option value="Price: High to Low">
                Price: High to Low
              </option>

              <option value="Rating">
                Rating
              </option>
            </select>
          </div>

          <p className="product-count">
            {sortedProducts.length}{" "}
            {sortedProducts.length === 1
              ? "product"
              : "products"}
          </p>
        </div>

        <div className="toolbar-right">
          <span>View products as</span>

          <button className="view-button">
            ☰
          </button>

          <button className="view-button">
            ▦
          </button>
        </div>

      </div>


      {/* MAIN SHOP CONTENT */}
      <div className="shop-content">

        {/* FILTER SIDEBAR */}
        <aside className="filter-sidebar">

          <button
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>


          {/* AVAILABILITY */}
          <div className="filter-group">
            <h3>Availability</h3>

            <label>
              <input type="checkbox" />

              <span>
                In stock
              </span>

              <span className="filter-count">
                (
                {
                  products.filter(
                    (product) => product.stock > 0
                  ).length
                }
                )
              </span>
            </label>

            <label className="disabled-filter">
              <input type="checkbox" />

              <span>
                Out of stock
              </span>

              <span className="filter-count">
                (
                {
                  products.filter(
                    (product) => product.stock === 0
                  ).length
                }
                )
              </span>
            </label>
          </div>


          {/* CATEGORY FILTER */}
          <div className="filter-group">
            <h3>Categories</h3>

            <label>
              <input
                type="radio"
                name="category"
                checked={
                  selectedCategory === "All"
                }
                onChange={() =>
                  setSelectedCategory("All")
                }
              />

              <span>
                All Products
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="category"
                checked={
                  selectedCategory === "Cookware"
                }
                onChange={() =>
                  setSelectedCategory("Cookware")
                }
              />

              <span>
                Cookware
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="category"
                checked={
                  selectedCategory === "Bakeware"
                }
                onChange={() =>
                  setSelectedCategory("Bakeware")
                }
              />

              <span>
                Bakeware
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="category"
                checked={
                  selectedCategory === "Utensils"
                }
                onChange={() =>
                  setSelectedCategory("Utensils")
                }
              />

              <span>
                Utensils
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="category"
                checked={
                  selectedCategory ===
                  "Baking Accessories"
                }
                onChange={() =>
                  setSelectedCategory(
                    "Baking Accessories"
                  )
                }
              />

              <span>
                Baking Accessories
              </span>
            </label>
          </div>


          {/* PRICE FILTER */}
          <div className="filter-group">
            <h3>Price</h3>

            <label>
              <input
                type="radio"
                name="price"
                checked={
                  selectedPrice === "All"
                }
                onChange={() =>
                  setSelectedPrice("All")
                }
              />

              <span>
                All Prices
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="price"
                checked={
                  selectedPrice === "Under 50"
                }
                onChange={() =>
                  setSelectedPrice("Under 50")
                }
              />

              <span>
                Under GH₵50
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="price"
                checked={
                  selectedPrice === "50-100"
                }
                onChange={() =>
                  setSelectedPrice("50-100")
                }
              />

              <span>
                GH₵50 - GH₵100
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="price"
                checked={
                  selectedPrice === "100+"
                }
                onChange={() =>
                  setSelectedPrice("100+")
                }
              />

              <span>
                GH₵100+
              </span>
            </label>
          </div>

        </aside>


        {/* PRODUCT GRID */}
        <section className="shop-products-area">

          {sortedProducts.length > 0 ? (
            <div className="shop-products-grid">

              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>
          ) : (
            <div className="no-products">
              <h2>
                No products found
              </h2>

              <p>
                Try changing your filters or
                search term.
              </p>
            </div>
          )}

        </section>

      </div>

    </main>
  );
}

export default Shop;