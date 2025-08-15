import React, { useState } from "react";
import "./SignIn.css";
import logo from "../assets/philonet.png";

export default function SignIn() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password match check for sign up
    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    // Submit logic here
    console.log({
      name: !isSignIn ? name : undefined,
      email,
      password
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Brand Header */}
        <div className="brand-header">
          <img src={logo} alt="Philonet Logo" className="login-logo" />
          <span className="brand-name">philonet</span>
        </div>

        {/* Title & Description */}
       
        <p className="welcome-text">
          {isSignIn
            ? "Welcome to the thinking layer of real conversations"
            : "Create your account to start your journey"}
        </p>

        {/* Error Message */}
        {error && <p className="error-text">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isSignIn && (
            <input
              type="text"
              placeholder="Enter your name"
              className="login-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Enter your email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isSignIn && (
            <input
              type="password"
              placeholder="Confirm your password"
              className="login-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          <button type="submit" className="login-btn">
            {isSignIn ? "Login" : "Register"}
          </button>
        </form>

        {isSignIn ? (
          <>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
            <a
              href="#"
              className="forgot-link"
              onClick={(e) => {
                e.preventDefault();
                setIsSignIn(false);
              }}
            >
              Not registered? Sign Up
            </a>
          </>
        ) : (
          <a
            href="#"
            className="forgot-link"
            onClick={(e) => {
              e.preventDefault();
              setIsSignIn(true);
            }}
          >
            Already have an account? Sign In
          </a>
        )}
      </div>
    </div>
  );
}
