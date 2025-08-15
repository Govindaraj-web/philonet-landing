import React from "react";
import logoImg from "../assets/philonet.png";


export default function BottomNavbar({ sectionsConfig, activeSection, scrollToSection }) {
  return (
    <nav className="bottom-navbar">
      <img
        src={logoImg}
        alt="Philonet Logo"
        className="logo"
        onClick={() => scrollToSection(0, true)}
      />
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
  );
}
