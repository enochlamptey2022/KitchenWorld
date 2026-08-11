import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Registration failed"
        );
      }

      navigate("/login");

    } catch (error) {
      console.error(error);

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-card">

        <p className="register-eyebrow">
          Create your Kitchen World account
        </p>

        <h1>
          Create account
        </h1>

        <p className="register-subtitle">
          Join Kitchen World and enjoy
          a better shopping experience.
        </p>

        {error && (
          <p className="register-error">
            {error}
          </p>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          <div className="register-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

          </div>


          <div className="register-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          <div className="register-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>


          <div className="register-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

          </div>


          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        <p className="register-switch">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Register;