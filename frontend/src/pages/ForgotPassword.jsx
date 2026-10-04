import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <Link to="/" className="auth-logo">
          Uni<span>Go</span>
        </Link>

        <h1>Forgot Password?</h1>

        <p className="auth-subtitle">
          Enter your registered email address and we'll help you reset your
          password.
        </p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <p className="switch-auth">
          Remember your password?{" "}
          <Link to="/login">Back to Login</Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;