import React from "react";


export default function DotsNavigation({ sectionsConfig, activeSection, scrollToSection }) {
  return (
    <div className="dots-navigation">
      {sectionsConfig.map((sec, i) => (
        <span
          key={sec.name}
          title={sec.name}
          className={`dot ${activeSection === i ? "active" : ""}`}
          onClick={() => scrollToSection(i, true)}
        />
      ))}
    </div>
  );
}
