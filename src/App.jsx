import React from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LandingPage from "./components/LandingPage";
import BlogDetails from "./pages/BlogDetails"; 
import Feed from "./pages/PhilonetNewsFeed"

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<LandingPage />} />
        <Route path="/about" element={<LandingPage />} />
        <Route path="/blogs" element={<LandingPage />} />
        <Route path="/blogs/:articleId" element={<BlogDetails />} />
        <Route path="/sign-in" element={<LandingPage />} />
        <Route path="/feed" element={<Feed />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </HelmetProvider>
  );
}
