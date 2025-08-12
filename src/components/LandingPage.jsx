import React, { useState, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./LandingPage.css";

const sections = [
  { name: "Home", title: "Home | Philonet", description: "Philonet - A New Friendship Is One Thought Away" },
  { name: "How it works", title: "How it works | Philonet", description: "Philonet works step by step." },
  { name: "About", title: "Projects | Philonet", description: "Explore our projects" },
  { name: "Blogs", title: "Blogs | Philonet", description: "Read the latest blogs" },
  { name: "Sign in", title: "Sign in | Philonet", description: "Get in touch with us" }
];

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);
  const wrapperRef = useRef(null);

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const scrollPos = wrapperRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const index = Math.round(scrollPos / windowHeight);
    setActiveSection(index);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{sections[activeSection].title}</title>
        <meta name="description" content={sections[activeSection].description} />
      </Helmet>

      {/* Bottom Navbar */}
      <nav className="bottom-navbar">
        <div className="logo">philonet</div>
        <div className="nav-links">
          {sections.map((item, i) => (
            <span
              key={i}
              className={`nav-item ${activeSection === i ? "active" : ""}`}
              onClick={() => scrollToSection(i)}
            >
              {item.name}
            </span>
          ))}
        </div>
      </nav>

      {/* Right Side Dots */}
      <div className="dots-navigation">
        {sections.map((sec, i) => (
          <span
            key={i}
            title={sec.name}
            className={`dot ${activeSection === i ? "active" : ""}`}
            onClick={() => scrollToSection(i)}
          />
        ))}
      </div>

      {/* Sections */}
      <div
        className="fullpage-wrapper"
        ref={wrapperRef}
        onScroll={handleScroll}
      >
        {sections.map((sec, i) => (
          <section
            key={i}
            className="section"
            ref={(el) => (sectionRefs.current[i] = el)}
          >
            {sec.description}
          </section>
        ))}
      </div>
    </HelmetProvider>
  );
}
