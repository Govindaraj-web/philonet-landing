import React, { useState } from "react";
import "./SignIn.css";
import logo from "../assets/philonet.png";

export default function SignIn() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Philonet Logo" className="login-logo" />

        {/* Title & Description */}
        <h2>{isSignIn ? "Sign In" : "Sign Up"}</h2>
        <p className="welcome-text">
          {isSignIn
            ? "Welcome to the thinking layer of real conversations"
            : "Create your account to start your journey"}
        </p>

        {/* Form */}
        {!isSignIn && (
          <input
            type="text"
            placeholder="Enter your name"
            className="login-input"
          />
        )}
        <input
          type="email"
          placeholder="Enter your email"
          className="login-input"
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="login-input"
        />
        {!isSignIn && (
          <input
            type="password"
            placeholder="Confirm your password"
            className="login-input"
          />
        )}

        <button className="login-btn">
          {isSignIn ? "Login" : "Register"}
        </button>

        {isSignIn && (
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
        )}

        {!isSignIn && (
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
