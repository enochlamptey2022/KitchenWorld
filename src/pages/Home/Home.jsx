import "./Home.css";
import heroImage from "../../assets/kitchen2.png";

import cookwareImg from "../../assets/categories/cookware.jpg";
import bakewareImg from "../../assets/categories/bakeware.jpg";
import utensilsImg from "../../assets/categories/utensils.jpg";
import bakingAccessoriesImg from "../../assets/categories/baking-accessories.jpg";

import { useRef } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../data/products";




function Home({ addToCart }) {
  const categoriesRef = useRef(null);

  const categoryItems = [
    {
      name: "Cookware",
      tagline: "Cookware to unleash kitchen creativity",
      image: cookwareImg,
      query: "cookware",
    },
    {
      name: "Bakeware",
      tagline: "Bakeware for perfect home-made treats",
      image: bakewareImg,
      query: "bakeware",
    },
    {
      name: "Utensils",
      tagline: "Utensils that simplify every recipe",
      image: utensilsImg,
      query: "utensils",
    },
    {
      name: "Baking Accessories",
      tagline: "Accessories for neat finishing touches",
      image: bakingAccessoriesImg,
      query: "baking accessories",
    },
    {
      name: "Cast Iron",
      tagline: "Cast iron made for deep flavor and sear",
      image: cookwareImg,
      query: "cast iron",
    },
    {
      name: "Roasting",
      tagline: "Roasting essentials for hearty meals",
      image: bakewareImg,
      query: "roasting",
    },
    {
      name: "Storage",
      tagline: "Storage picks to keep your kitchen tidy",
      image: utensilsImg,
      query: "storage",
    },
    {
      name: "Speciality Cookware",
      tagline: "Speciality pans for bold cooking ideas",
      image: bakingAccessoriesImg,
      query: "speciality cookware",
    },
  ];

  const scrollCategories = (direction) => {
    if (!categoriesRef.current) {
      return;
    }

    const scrollAmount = 320;

    categoriesRef.current.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <main>
      <section className="hero">
        <img
          src={heroImage}
          alt="Kitchenware collection"
          className="hero-image"
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="hero-subtitle">Made for everyday cooking</p>

          <h1>
            Cook. Bake.
            <br />
            Create.
          </h1>

          <p className="hero-description">
            Discover kitchen essentials designed to make cooking and baking
            easier, better and more enjoyable.
          </p>

          <Link to="/shop" className="hero-button">
            SHOP NOW
          </Link>
        </div>
      </section>

      <section className="home-info-bars" aria-label="Store highlights">
        <div className="home-info-bar">
          <strong>Pay-in-3</strong>
          <span>Shop now, pay later with Klarna</span>
        </div>

        <div className="home-info-bar">
          <strong>Free delivery</strong>
          <span>When you spend GHc60</span>
        </div>

        <div className="home-info-bar">
          <strong>Excellent</strong>
          <span>4.8 out of 5 Trustpilot</span>
        </div>
      </section>

{/* category */}

<section className="categories-section">
  <div className="section-heading-row">
    <div className="section-heading">
      <p>Explore our various collection</p>
      <h2>Shop by Category</h2>
    </div>
  </div>

  <div className="categories-slider-row">
    <div className="categories-grid" ref={categoriesRef}>
      {categoryItems.map((category) => (
        <Link
          key={category.name}
          to={`/shop?category=${encodeURIComponent(category.query)}`}
          className="category-card"
        >
          <div
            className="category-image"
            style={{ backgroundImage: `url(${category.image})` }}
          ></div>
          <div className="category-label">
            <h3>{category.tagline}</h3>
            <span className="category-offer">Shop offer</span>
          </div>
        </Link>
      ))}
    </div>

    <div className="category-scroll-controls" aria-label="Category navigation">
      <button
        type="button"
        className="category-scroll-btn next"
        onClick={() => scrollCategories("next")}
        aria-label="Next categories"
      >
        &gt;
      </button>

      <button
        type="button"
        className="category-scroll-btn prev"
        onClick={() => scrollCategories("prev")}
        aria-label="Previous categories"
      >
        &lt;
      </button>
    </div>
  </div>
</section>

<section className="featured-products-section">
  <div className="featured-header">
    <h2>Featured Products. Essential tools, everyday advantage.</h2>
    <Link to="/shop" className="featured-view-all">View all products</Link>
  </div>

  <div className="featured-products-grid">
    {products.map((product) => (
     <ProductCard
  key={product.id}
  product={product}
  addToCart={addToCart}
/>
    ))}
  </div>
</section>

<section className="student-promo-section" aria-label="Student offer">
  <div className="student-promo-content">
    <div className="student-promo-left">
      <p className="student-promo-kicker">Kitchen World student perks</p>
      <h2>
        Your uni
        <br />
        kitchen <em>sorted.</em>
      </h2>
      <p className="student-promo-brand">Available exclusively with StudentBeans</p>
    </div>

    <div className="student-promo-right">
      <p>Students, get 10% off when you spend GHc300</p>
      <Link to="/shop" className="student-promo-button">Shop The Collection</Link>
    </div>
  </div>
</section>
      

      
    </main>
  );
}

export default Home;