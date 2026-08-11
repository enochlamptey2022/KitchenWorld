import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header/Header";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer/Footer";

import PaymentCallback from "./pages/PaymentCallback/PaymentCallback";
import Admin from "./pages/Admin/Admin";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Account from "./pages/Account/Account";
import SearchResults from "./pages/SearchResults/SearchResults";


function AppContent({
  user,
  setUser,
  searchTerm,
  setSearchTerm,
  cart,
  addToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
  clearCart,
  cartCount,
}) {
  const location = useLocation();

  const hideMainLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideMainLayout && (
        <>
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            cartCount={cartCount}
          />

          <Navbar />
        </>
      )}

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/shop"
          element={
            <Shop
              searchTerm={searchTerm}
            />
          }
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseCartQuantity={
                increaseCartQuantity
              }
              decreaseCartQuantity={
                decreaseCartQuantity
              }
              removeFromCart={
                removeFromCart
              }
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              clearCart={clearCart}
            />
          }
        />

        <Route
          path="/order-confirmation"
          element={
            <OrderConfirmation />
          }
        />

        <Route
          path="/login"
          element={
            <Login
              setUser={setUser}
            />
          }
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />

<Route
  path="/search"
  element={<SearchResults />}
/>
        <Route
          path="/account"
          element={
            <Account
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route
          path="/payment/callback"
          element={
            <PaymentCallback
              clearCart={clearCart}
            />
          }
        />

      </Routes>

      {!hideMainLayout && (
        <Footer />
      )}
    </>
  );
}


function App() {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [searchTerm, setSearchTerm] =
    useState("");

  const [cart, setCart] = useState(() => {
    const savedCart =
      localStorage.getItem("cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });


  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);


  const addToCart = (
    product,
    quantity
  ) => {
    const existingItem =
      cart.find(
        (item) =>
          item.id === product.id
      );

    if (existingItem) {
      const updatedCart =
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  quantity,
              }
            : item
        );

      setCart(updatedCart);

    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity,
        },
      ]);
    }
  };


  const increaseCartQuantity =
    (productId) => {

      setCart(
        cart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );
    };


  const decreaseCartQuantity =
    (productId) => {

      setCart(
        cart.map((item) =>
          item.id === productId &&
          item.quantity > 1
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
      );
    };


  const removeFromCart =
    (productId) => {

      setCart(
        cart.filter(
          (item) =>
            item.id !== productId
        )
      );
    };


  const clearCart = () => {
    setCart([]);
  };


  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  return (
    <BrowserRouter>

      <AppContent
        user={user}
        setUser={setUser}

        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}

        cart={cart}
        addToCart={addToCart}

        increaseCartQuantity={
          increaseCartQuantity
        }

        decreaseCartQuantity={
          decreaseCartQuantity
        }

        removeFromCart={
          removeFromCart
        }

        clearCart={clearCart}

        cartCount={cartCount}
      />

    </BrowserRouter>
  );
}

export default App;