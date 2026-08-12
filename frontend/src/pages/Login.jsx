import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInWithGitHub } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signIn({
  email: email.trim().toLowerCase(),
  password,
});

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Google login failed.");
    }
  };

  const handleGitHubLogin = async () => {
    setError("");

    try {
      await signInWithGitHub();
    } catch (err) {
      setError(err.message || "GitHub login failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span>CharGen</span> AI
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Sign in to continue creating amazing AI artwork.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="social-btn"
          >
            <span>G</span>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGitHubLogin}
            className="social-btn"
          >
            <span>◉</span>
            Continue with GitHub
          </button>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;