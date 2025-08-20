import React, { useState } from "react";
import logoImg from "../assets/philonet.png";
import { Menu, X } from "lucide-react";

export default function BottomNavbar({ sectionsConfig, activeSection, scrollToSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Bottom navbar (desktop full, mobile logo only) */}
      <nav className="bottom-navbar">
        <div className="logo-wrap" onClick={() => scrollToSection(0, true)}>
          <img src={logoImg} alt="Philonet Logo" className="logo" />
          <span className="logo-text">Philonet</span>
        </div>

        {/* Nav links - hidden on mobile */}
        <div className="nav-links">
          {sectionsConfig.map((item, i) => (
            <span
              key={item.name}
              className={`nav-item ${activeSection === i ? "active" : ""}`}
               style={{ color: i === 0 ? "#3F8EFC" : "grey" }}
              onClick={() => scrollToSection(i, true)}
            >
              {item.name}
            </span>
          ))}
        </div>
      </nav>

      {/* Hamburger menu button - only mobile */}
      <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>
        <Menu size={28} />
      </button>

      {/* Side menu (mobile) */}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
          <X size={28} />
        </button>

        <div className="side-links">
          {sectionsConfig.map((item, i) => (
            <span
              key={item.name}
              className={`side-item ${item.name === "Sign in" ? "signin-btn" : ""}`}
              onClick={() => {
                scrollToSection(i, true);
                setIsMenuOpen(false);
              }}
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
