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
            <h3>About Kitchen World</h3>
            <div className="footer-links-grid">
              <a href="#">About us</a>
              <a href="#">Contact us</a>
              <a href="#">Our store</a>
            </div>
          </div>

          <div className="footer-links-group">
            <h3>Customer Service</h3>
            <div className="footer-links-grid service-grid">
              <a href="#">FAQs</a>
              <a href="#">Age restricted goods policy</a>
              <a href="#">Delivery tracker</a>
              <a href="#">Terms & conditions</a>
              <a href="#">Privacy policy</a>
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

        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © Kitchen World 2026</p>
      </div>
    </footer>
  );
}

export default Footer;