import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import HowItWorks from "../pages/HowItWorks";
import About from "../pages/About";
import Blogs from "../pages/Blogs";
import SignIn from "../pages/SignIn";
import BottomNavbar from "./BottomNavbar";
import DotsNavigation from "./DotsNavigation";
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
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // simulate loading time (e.g., images, API, etc.)
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

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
  
   // Initial load: always start at Home
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

  // Smooth scroll function
const scrollToSection = (index) => {
  const el = sectionRefs.current[index];
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};


  // Scroll handler for detecting active section
 const handleScroll = () => {
  const container = wrapperRef.current;
  if (!container) return;

  const scrollPos = container.scrollTop;
  let foundIndex = 0;

  sectionRefs.current.forEach((el, idx) => {
    if (el.offsetTop <= scrollPos + 10) { // small threshold
      foundIndex = idx;
    }
  });

  if (foundIndex !== activeSection) setActiveSection(foundIndex);
};



  return (
    <>
     {!isLoaded && (
        <div className="loading-screen">
          <div className="loading-box">
            <div className="loading-brand">Philonet</div>
            <div className="loading-text">Loading</div>
            <div className="loading-bar">
              <div className="loading-bar-fill"></div>
            </div>
          </div>
        </div>
      )}
      <Helmet>
        <title>{sectionsConfig[activeSection].title}</title>
        <meta
          name="description"
          content={sectionsConfig[activeSection].description}
        />
        
      </Helmet>

      <BottomNavbar
        sectionsConfig={sectionsConfig}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

      <DotsNavigation
        sectionsConfig={sectionsConfig}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />

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
