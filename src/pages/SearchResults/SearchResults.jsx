import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../../components/ProductCard/ProductCard";

import "./SearchResults.css";

function SearchResults() {
  const [searchParams] = useSearchParams();

  const query =
    searchParams.get("q") || "";

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            "Unable to load products"
          );
        }

        const formattedProducts =
          data.map((product) => ({
            ...product,
            price: Number(product.price),
            rating: Number(
              product.rating || 0
            ),
          }));

        setProducts(
          formattedProducts
        );

        setError("");

      } catch (error) {
        console.error(error);

        setError(
          "Unable to load search results."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);


  const searchText =
    query.trim().toLowerCase();


  const matchingProducts =
    products.filter((product) => {

      const name =
        product.name
          ?.toLowerCase() || "";

      const category =
        product.category
          ?.toLowerCase() || "";

      const description =
        product.description
          ?.toLowerCase() || "";

      return (
        name.includes(searchText) ||
        category.includes(searchText) ||
        description.includes(searchText)
      );
    });


  return (
    <main className="search-results-page">

      <div className="search-results-header">

        <h1>
          Search Results
        </h1>

        <p>
          Results for{" "}
          <strong>
            "{query}"
          </strong>
        </p>

      </div>


      {loading && (
        <p>
          Searching products...
        </p>
      )}


      {error && (
        <p className="search-results-error">
          {error}
        </p>
      )}


      {!loading &&
        !error &&
        matchingProducts.length === 0 && (

          <div className="no-search-results">

            <h2>
              No products found
            </h2>

            <p>
              We couldn't find anything
              matching "{query}".
            </p>

          </div>

        )}


      {!loading &&
        !error &&
        matchingProducts.length > 0 && (

          <>
            <p className="search-count">
              {matchingProducts.length}{" "}
              {matchingProducts.length === 1
                ? "product"
                : "products"}{" "}
              found
            </p>

            <div className="search-products-grid">

              {matchingProducts.map(
                (product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                )
              )}

            </div>
          </>

        )}

    </main>
  );
}

export default SearchResults;