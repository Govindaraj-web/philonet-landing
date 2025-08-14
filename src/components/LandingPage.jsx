import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import logoImg from "../assets/philonet.png";
import Home from "../pages/Home";
import HowItWorks from "../pages/HowItWorks";
import About from "../pages/About";
import Blogs from "../pages/Blogs";
import SignIn from "../pages/SignIn";
import "./LandingPage.css";

const sectionsConfig = [
  { name: "Home",         title: "Home | Philonet",         description: "Philonet - A New Friendship Is One Thought Away", path: "/" },
  { name: "How it works", title: "How it works | Philonet", description: "Philonet works step by step",                      path: "/how-it-works" },
  { name: "About",        title: "Projects | Philonet",     description: "Explore our projects",                             path: "/about" },
  { name: "Blogs",        title: "Blogs | Philonet",        description: "Read the latest blogs",                            path: "/blogs" },
  { name: "Sign in",      title: "Sign in | Philonet",      description: "Get in touch with us",                             path: "/sign-in" },
];

const sectionComponents = [Home, HowItWorks, About, Blogs, SignIn];

export default function LandingPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const sectionRefs = useRef([]);
  const wrapperRef = useRef(null);

  const pathToIndex = useMemo(() => {
    const map = new Map();
    sectionsConfig.forEach((s, i) => map.set(s.path, i));
    return map;
  }, []);

  
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    navigate("/", { replace: true });
    setTimeout(() => {
      sectionRefs.current[0]?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 0);
  }, []);

  // Scroll to section based on URL
  useEffect(() => {
    const idx = pathToIndex.get(pathname);
    if (typeof idx === "number" && idx !== activeSection) {
      setActiveSection(idx);
      setTimeout(() => {
        sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [pathname]);

  // Update URL when active section changes
  useEffect(() => {
    const desiredPath = sectionsConfig[activeSection].path;
    if (pathname !== desiredPath) {
      navigate(desiredPath, { replace: true });
    }
  }, [activeSection]);

  const scrollToSection = (index, pushToHistory = true) => {
    const el = sectionRefs.current[index];
    if (!el) return;
    const path = sectionsConfig[index].path;
    if (pushToHistory && pathname !== path) {
      navigate(path, { replace: false });
    }
    el.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = wrapperRef.current;
    if (!container) return;
    const scrollPos = container.scrollTop;
    const windowHeight = window.innerHeight;
    const index = Math.round(scrollPos / windowHeight);
    if (index !== activeSection) setActiveSection(index);
  };

  return (
    <>
      <Helmet>
        <title>{sectionsConfig[activeSection].title}</title>
        <meta
          name="description"
          content={sectionsConfig[activeSection].description}
        />
      </Helmet>

      {/* Bottom Navbar */}
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

      {/* Right Side Dots */}
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

      {/* Sections (full-page snap) */}
      <div
        className="fullpage-wrapper"
        ref={wrapperRef}
        onScroll={handleScroll}
      >
        {sectionComponents.map((Comp, i) => (
          <section
            key={sectionsConfig[i].name}
            className="section"
            ref={(el) => (sectionRefs.current[i] = el)}
          >
            <Comp />
          </section>
        ))}
      </div>
    </>
  );
}
