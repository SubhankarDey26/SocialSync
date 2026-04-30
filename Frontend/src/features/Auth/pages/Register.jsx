import "../styles/form.scss";
import { Link } from 'react-router';
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { loading, HandleRegister } = useAuth();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await HandleRegister(username, email, password);
    navigate('/');
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Creating your account…</span>
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
            Join thousands of creators. Share your world and find your people on SocialSync.
          </p>
          <div className="aside-dots">
            <span className="dot" />
            <span className="dot active" />
            <span className="dot" />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="form-panel">
        <div className="form-container">
          <p className="form-eyebrow">Get started</p>
          <h2 className="form-title">Create your account</h2>
          <p className="form-sub">Already have one? <Link to="/login">Sign in</Link></p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                required
                onInput={(e) => setusername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                onInput={(e) => setemail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                required
                onInput={(e) => setpassword(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn">Create Account</button>

            <span className="extra">
              Already have an account? <Link to="/login">Sign in</Link>
            </span>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;