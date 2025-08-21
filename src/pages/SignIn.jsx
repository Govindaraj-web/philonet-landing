import React, { useState } from "react";
import logo from "../assets/philonet.png";
import "./SignIn.css";
import { useGoogleLogin } from "@react-oauth/google";

export default function WelcomePanel() {
  const [user, setUser] = useState(null);

  // Google OAuth login handler
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user profile from Google API
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await res.json();
        setUser(userInfo);
        console.log("User Info:", userInfo);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },
    onError: () => console.log("Login Failed"),
    scope: "openid profile email",
  });

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

        {/* Custom Google OAuth Button */}
        {!user ? (
          <button className="custom-google-btn" onClick={() => login()}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="google-icon"
            />
            Continue with Google
          </button>
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
