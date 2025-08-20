import React, { useState } from "react";
import logo from "../assets/philonet.png";
import "./SignIn.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function WelcomePanel() {
  const [user, setUser] = useState(null);

  return (
    <div className="welcome-container">
      {/* Card */}
      <div className="welcome-card">
        <img src={logo} alt="Philonet Logo" className="brand-logo" />

        <h2 className="welcome-title">Welcome to Philonet</h2>
        <p className="welcome-subtitle">
          Your thinking layer over the internet — capture sparks as you browse,
          share ideas, and connect with like-minded people while learning what
          matters to you.
        </p>

        {/* Features */}
        <ul className="feature-list">
          <li>
            <span className="bullet" /> <b>Spark Anywhere</b> — Share moments and
            ideas as you explore the web
          </li>
          <li>
            <span className="bullet" /> <b>Only What Matters</b> — A feed shaped
            by your interests
          </li>
          <li>
            <span className="bullet" /> <b>Better Learning</b> — Turn discoveries
            into lasting knowledge
          </li>
          <li>
            <span className="bullet" /> <b>Real Connections</b> — Engage with
            communities that inspire you
          </li>
        </ul>

        {/* Google OAuth Login */}
        {!user ? (
          <GoogleLogin
            onSuccess={(response) => {
              const userInfo = jwtDecode(response.credential);
              setUser(userInfo);
              console.log("User Info:", userInfo);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        ) : (
          <div className="user-popup">
            <button className="close-btn" onClick={() => setUser(null)}>×</button>
            <img src={user.picture} alt={user.name} className="profile-pic" />
            <p className="u-name">Welcome, <b>{user.name}</b> 👋</p>
            <p className="email">{user.email}</p>
          </div>
        )}

        <p className="footer-text">
          New to Philonet? We’ll create your account automatically when you sign
          in.
        </p>
      </div>
    </div>
  );
}
