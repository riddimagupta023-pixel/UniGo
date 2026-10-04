import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset link.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to reset password. Please try again."
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

        <h1>Reset Password</h1>

        <p className="auth-subtitle">
          Enter your new password below.
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

          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;