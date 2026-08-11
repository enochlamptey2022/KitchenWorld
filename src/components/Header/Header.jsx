import {
  Link,
  useNavigate,
} from "react-router-dom";
import "./Header.css";
import { FiUser, FiShoppingBag } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";




function Header({
  searchTerm,
  setSearchTerm,
  cartCount,
}) {const navigate = useNavigate();

const handleSearch = () => {
  const value = searchTerm.trim();

  if (!value) {
    return;
  }

  navigate(
    `/search?q=${encodeURIComponent(value)}`
  );
};
  return (

    
    <header className="header">
     <div className="header-logo">
  <Link to="/" className="logo-link">
    <div className="brand-logo">
      <span className="brand-kitchen">Kitchen</span>

      <div className="brand-bottom">
        <span className="brand-world">World</span>
      </div>
    </div>
  </Link>
</div>

    <div className="search-bar">
  <input
  type="text"
  placeholder="Search for items"
  value={searchTerm}
  onChange={(event) =>
    setSearchTerm(event.target.value)
  }
  onKeyDown={(event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  }}
/>
  <FiSearch
  className="search-icon"
  onClick={handleSearch}
/>
</div>




 <div className="header-actions">

  <Link to="/login" className="header-action">
    <FiUser className="header-action-icon" />
    <span>Account</span>
  </Link>

  <Link to="/cart" className="header-action cart-action">
    <div className="cart-icon-wrapper">
      <FiShoppingBag className="header-action-icon" />

      {cartCount > 0 && (
        <span className="cart-count">
          {cartCount}
        </span>
      )}
    </div>

    <span>Cart</span>
  </Link>

</div>

    </header>
  );
}

export default Header;