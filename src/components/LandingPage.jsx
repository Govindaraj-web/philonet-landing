
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ReactFullpage from "@fullpage/react-fullpage";
import "./LandingPage.css";

const sections = [
  { name: "Home", title: "Home | Philonet", description: "Philonet - A New Friendship Is One Thought Away" },
  { name: "How it works", title: "How it works | Philonet", description: "Philonet works step by step." },
  { name: "About", title: "Projects | Philonet", description: "Explore our projects" },
  { name: "Blogs", title: "Blogs | Philonet", description: "Read the latest blogs" },
  { name: "Sign in", title: "Sign in | Philonet", description: "Get in touch with us" }
];


export default function LandingPage() {
  const [activeSection, setActiveSection] = React.useState(0);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{sections[activeSection].title}</title>
        <meta name="description" content={sections[activeSection].description} />
      </Helmet>

      <nav className="bottom-navbar">
        <div className="logo">philonet</div>
        <div className="nav-links">
          {sections.map((item, i) => (
            <span
              key={i}
              className={`nav-item ${activeSection === i ? "active" : ""}`}
              onClick={() => {
                document.querySelectorAll(".fp-nav ul li a")[i]?.click();
              }}
            >
              {item.name}
            </span>
          ))}
        </div>
      </nav>

      {/* Fullpage sections using render prop */}
      <ReactFullpage
        licenseKey={'OPEN-SOURCE-GPLV3-LICENSE'}
        navigation
        navigationPosition="right"
        scrollingSpeed={800}
        onLeave={(_, destination) => setActiveSection(destination.index)}
        render={({ state, fullpageApi }) => {
          return (
            <div>
              {sections.map((sec, i) => (
                <div className="section" key={i}>
                  {sec.description}
                </div>
              ))}
            </div>
          );
        }}
      />

    </HelmetProvider>
  );
}
