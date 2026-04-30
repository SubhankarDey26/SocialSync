import "../styles/form.scss";
import { Link } from 'react-router';
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const { loading, HandleLogin } = useAuth();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  async function SubmitHandler(e) {
    e.preventDefault();
    await HandleLogin(username, password);
    navigate('/');
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Signing you in…</span>
      </div>
    );
  }

  return (
    <main className="login-page">
      {/* Left decorative side */}
      <div className="form-aside">
        <div className="aside-content">
          <h1 className="aside-logo">
            Social<span>Sync</span>
          </h1>
          <p className="aside-tagline">
            Share your moments. Connect with people who matter. Build your story, one post at a time.
          </p>
          <div className="aside-dots">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="form-panel">
        <div className="form-container">
          <p className="form-eyebrow">Welcome back</p>
          <h2 className="form-title">Sign in to your account</h2>
          <p className="form-sub">Don't have one? <Link to="/register">Create an account</Link></p>

          <form onSubmit={SubmitHandler}>
            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                required
                onInput={(e) => setusername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                onInput={(e) => setpassword(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn">Sign In</button>

            <span className="extra">
              New here? <Link to="/register">Create account</Link>
            </span>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;