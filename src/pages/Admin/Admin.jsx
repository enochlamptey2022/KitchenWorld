import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();

  // =====================================
  // PRODUCT STATES
  // =====================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [addingProduct, setAddingProduct] =
    useState(false);

  const [editingProductId, setEditingProductId] =
    useState(null);

  const [updatingProduct, setUpdatingProduct] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    rating: "",
    description: "",
  });


  // =====================================
  // ORDER STATES
  // =====================================

  const [orders, setOrders] = useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(true);


  // =====================================
  // LOAD PRODUCTS
  // =====================================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load products"
        );
      }

      const formattedProducts = data.map(
        (product) => ({
          ...product,
          price: Number(product.price),
          rating: Number(product.rating || 0),
        })
      );

      setProducts(formattedProducts);

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };


  // =====================================
  // LOAD ALL ORDERS
  // =====================================

  const fetchOrders = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://${import.meta.env.VITE_API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to load orders"
        );
      }

      const formattedOrders = data.map(
        (order) => ({
          ...order,

          total_amount:
            Number(order.total_amount),

          delivery_fee:
            Number(order.delivery_fee || 0),
        })
      );

      setOrders(formattedOrders);

    } catch (error) {
      console.error(error);
      setError(error.message);

    } finally {
      setOrdersLoading(false);
    }
  };


  // =====================================
  // CHECK ADMIN + LOAD DATA
  // =====================================

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const savedUser =
          localStorage.getItem("user");

        const user = savedUser
          ? JSON.parse(savedUser)
          : null;

        if (
          !token ||
          user?.role !== "admin"
        ) {
          navigate("/");
          return;
        }

        await fetchProducts();
        await fetchOrders();

      } catch (error) {
        console.error(error);

        setError(
          "Unable to load admin dashboard"
        );

      } finally {
        setLoading(false);
      }
    };

    loadAdmin();

  }, [navigate]);


  // =====================================
  // HANDLE FORM INPUT
  // =====================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // =====================================
  // RESET PRODUCT FORM
  // =====================================

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      stock: "",
      image: "",
      rating: "",
      description: "",
    });

    setEditingProductId(null);
  };


  // =====================================
  // ADD PRODUCT
  // =====================================

  const handleAddProduct = async (event) => {
    event.preventDefault();

    setError("");

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingProduct(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: formData.name,

            price:
              Number(formData.price),

            category:
              formData.category,

            stock:
              Number(formData.stock),

            image:
              formData.image,

            rating:
              Number(formData.rating || 0),

            description:
              formData.description,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to add product"
        );
      }

      setProducts((currentProducts) => [
        ...currentProducts,

        {
          ...data,
          price: Number(data.price),
          rating: Number(data.rating || 0),
        },
      ]);

      resetForm();

      setShowAddForm(false);

    } catch (error) {
      console.error(error);

      setError(error.message);

    } finally {
      setAddingProduct(false);
    }
  };


  // =====================================
  // START EDITING PRODUCT
  // =====================================

  const handleEditClick = (product) => {
    setEditingProductId(product.id);

    setFormData({
      name:
        product.name || "",

      price:
        product.price || "",

      category:
        product.category || "",

      stock:
        product.stock || "",

      image:
        product.image || "",

      rating:
        product.rating || "",

      description:
        product.description || "",
    });

    setShowAddForm(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================
  // UPDATE PRODUCT
  // =====================================

  const handleUpdateProduct =
    async (event) => {

      event.preventDefault();

      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setUpdatingProduct(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${editingProductId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name:
                formData.name,

              price:
                Number(formData.price),

              category:
                formData.category,

              stock:
                Number(formData.stock),

              image:
                formData.image,

              rating:
                Number(formData.rating || 0),

              description:
                formData.description,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Unable to update product"
          );
        }

        const formattedUpdatedProduct = {
          ...data,

          price:
            Number(data.price),

          rating:
            Number(data.rating || 0),
        };

        setProducts(
          (currentProducts) =>
            currentProducts.map(
              (product) =>
                product.id ===
                editingProductId
                  ? formattedUpdatedProduct
                  : product
            )
        );

        resetForm();

      } catch (error) {
        console.error(error);

        setError(error.message);

      } finally {
        setUpdatingProduct(false);
      }
    };


  // =====================================
  // DELETE PRODUCT
  // =====================================

  const handleDeleteProduct =
    async (productId) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmDelete) {
        return;
      }

      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {

        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            method: "DELETE",

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
            "Unable to delete product"
          );
        }

        setProducts(
          (currentProducts) =>
            currentProducts.filter(
              (product) =>
                product.id !== productId
            )
        );

      } catch (error) {
        console.error(error);

        setError(error.message);
      }
    };


  // =====================================
  // UPDATE ORDER STATUS
  // =====================================

  const handleOrderStatusChange =
    async (
      orderId,
      newStatus
    ) => {

      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Unable to update order"
          );
        }

        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) =>
                order.id === orderId
                  ? {
                      ...order,
                      status:
                        data.order.status,
                    }
                  : order
            )
        );

      } catch (error) {
        console.error(error);

        setError(error.message);
      }
    };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <main className="admin-page">
        <p>
          Loading admin dashboard...
        </p>
      </main>
    );
  }


  return (
    <main className="admin-page">

      <div className="admin-container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-header">

          <div>
            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage Kitchen World
              products and customer
              orders.
            </p>
          </div>


          <button
            className="admin-add-button"

            onClick={() => {
              resetForm();

              setShowAddForm(
                !showAddForm
              );
            }}
          >
            {showAddForm
              ? "Cancel"
              : "Add Product"}
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <p className="admin-error">
            {error}
          </p>
        )}


        {/* =========================
            ADD PRODUCT FORM
        ========================= */}

        {showAddForm && (

          <form
            className="admin-product-form"
            onSubmit={
              handleAddProduct
            }
          >

            <h2>
              Add New Product
            </h2>


            <div className="admin-form-grid">


              <div>

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <div>

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="0.01"
                  required
                />

              </div>


              <div>

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Cookware">
                    Cookware
                  </option>

                  <option value="Bakeware">
                    Bakeware
                  </option>

                  <option value="Utensils">
                    Utensils
                  </option>

                  <option value="Baking Accessories">
                    Baking Accessories
                  </option>

                </select>

              </div>


              <div>

                <label>
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  required
                />

              </div>


              <div>

                <label>
                  Image Path
                </label>

                <input
                  type="text"
                  name="image"
                  value={
                    formData.image
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div>

                <label>
                  Rating
                </label>

                <input
                  type="number"
                  name="rating"
                  value={
                    formData.rating
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  max="5"
                  step="0.1"
                />

              </div>


              <div className="admin-form-full">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="4"
                />

              </div>

            </div>


            <button
              type="submit"
              className="admin-save-button"
              disabled={
                addingProduct
              }
            >
              {addingProduct
                ? "Adding Product..."
                : "Save Product"}
            </button>

          </form>

        )}


        {/* =========================
            EDIT PRODUCT FORM
        ========================= */}

        {editingProductId && (

          <form
            className="admin-product-form"
            onSubmit={
              handleUpdateProduct
            }
          >

            <h2>
              Edit Product
            </h2>


            <div className="admin-form-grid">


              <div>

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <div>

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={
                    formData.price
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="0.01"
                  required
                />

              </div>


              <div>

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Cookware">
                    Cookware
                  </option>

                  <option value="Bakeware">
                    Bakeware
                  </option>

                  <option value="Utensils">
                    Utensils
                  </option>

                  <option value="Baking Accessories">
                    Baking Accessories
                  </option>

                </select>

              </div>


              <div>

                <label>
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={
                    formData.stock
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  required
                />

              </div>


              <div>

                <label>
                  Image Path
                </label>

                <input
                  type="text"
                  name="image"
                  value={
                    formData.image
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div>

                <label>
                  Rating
                </label>

                <input
                  type="number"
                  name="rating"
                  value={
                    formData.rating
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  max="5"
                  step="0.1"
                />

              </div>


              <div className="admin-form-full">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="4"
                />

              </div>

            </div>


            <div className="admin-edit-buttons">

              <button
                type="submit"
                className="admin-save-button"
                disabled={
                  updatingProduct
                }
              >
                {updatingProduct
                  ? "Updating..."
                  : "Update Product"}
              </button>


              <button
                type="button"
                className="admin-cancel-button"
                onClick={
                  resetForm
                }
              >
                Cancel
              </button>

            </div>

          </form>

        )}


        {/* =========================
            PRODUCTS TABLE
        ========================= */}

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>

            </thead>


            <tbody>

              {products.map(
                (product) => (

                  <tr
                    key={
                      product.id
                    }
                  >

                    <td>
                      {product.id}
                    </td>

                    <td>
                      {product.name}
                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>
                      GH₵
                      {product.price.toFixed(
                        2
                      )}
                    </td>

                    <td>
                      {product.stock}
                    </td>

                    <td className="admin-actions">

                      <button
                        onClick={() =>
                          handleEditClick(
                            product
                          )
                        }
                      >
                        Edit
                      </button>


                      <button
                        onClick={() =>
                          handleDeleteProduct(
                            product.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>


        {/* =========================
            CUSTOMER ORDERS
        ========================= */}

        <section className="admin-orders-section">

          <div className="admin-orders-heading">

            <h2>
              Customer Orders
            </h2>

            <p>
              View and manage customer
              orders.
            </p>

          </div>


          {ordersLoading && (
            <p>
              Loading orders...
            </p>
          )}


          {!ordersLoading &&
            orders.length === 0 && (

              <p>
                No orders found.
              </p>

            )}


          {!ordersLoading &&
            orders.length > 0 && (

              <div className="admin-orders-list">


                {orders.map(
                  (order) => (

                    <div
                      className="admin-order-card"
                      key={order.id}
                    >

                      <div className="admin-order-top">

                        <div>

                          <h3>
                            Order #{order.id}
                          </h3>

                          <p>
                            {new Date(
                              order.created_at
                            ).toLocaleDateString()}
                          </p>

                        </div>


                        <select
                          value={
                            order.status
                          }

                          onChange={
                            (event) =>
                              handleOrderStatusChange(
                                order.id,
                                event.target.value
                              )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Processing">
                            Processing
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                      </div>


                      <div className="admin-order-grid">


                        <div>

                          <span>
                            Customer
                          </span>

                          <strong>
                            {order.customer_name}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Email
                          </span>

                          <strong>
                            {order.customer_email}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Phone
                          </span>

                          <strong>
                            {order.phone || "-"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Address
                          </span>

                          <strong>
                            {order.address || "-"}
                            {order.city
                              ? `, ${order.city}`
                              : ""}
                            {order.region
                              ? `, ${order.region}`
                              : ""}
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
                            Payment
                          </span>

                          <strong>
                            {order.payment_status}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Total
                          </span>

                          <strong>
                            GH₵
                            {order.total_amount.toFixed(
                              2
                            )}
                          </strong>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </section>

      </div>

    </main>
  );
}

export default Admin;