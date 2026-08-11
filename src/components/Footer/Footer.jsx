import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaCcVisa,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links-area">
          <div className="footer-links-group">
            <h3>About ProCook</h3>
            <div className="footer-links-grid">
              <a href="#">About us</a>
              <a href="#">Contact us</a>
              <a href="#">Our stores</a>
              <a href="#">The Pantry</a>
              <a href="#">Sustainability</a>
            </div>
          </div>

          <div className="footer-links-group">
            <h3>Customer Service</h3>
            <div className="footer-links-grid service-grid">
              <a href="#">FAQs</a>
              <a href="#">Age restricted goods policy</a>
              <a href="#">Delivery tracker</a>
              <a href="#">Student discount</a>
              <a href="#">Returns</a>
              <a href="#">Product care</a>
              <a href="#">Guarantees</a>
              <a href="#">Terms & conditions</a>
              <a href="#">Privacy policy</a>
              <a href="#">ProCook for Business</a>
              <a href="#">Gift Cards</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>

        <div className="footer-right-column">
          <div className="footer-social-block">
            <h3>Social links</h3>
            <div className="social-row">
              <a href="#" className="social-icon" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-payment-block">
            <h3>Payment options</h3>
            <div className="payment-row">
              <span className="payment-chip visa" aria-label="Visa"><FaCcVisa /></span>
              <span className="payment-chip momo" aria-label="Mobile Money">Mobile Money</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © Kitchen World 2026</p>
      </div>
    </footer>
  );
}

export default Footer;