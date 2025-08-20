import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Blog.css";

const defaultData = {
  name: "Philonet",
  title: "Designing Humane Social Systems",
  postedAt: "August 15, 2025",
  thumbnail: "https://placehold.co/1200x600/000000/ffffff/png?text=Thumbnail+Preview",
  description: "A blueprint for building a network where context, consent, and clarity drive every interaction.",
  categories: ["Product", "Design", "Trust & Safety"],
  tags: ["philosophy", "architecture", "sparks", "privacy"],
  summaryMarkdown: `
## Summary

This post outlines **Philonet**'s approach to building a humane network. We cover guiding principles, a simple content model ("spark"), and moderation levers.

### Highlights
- Context-first content primitives
- Transparent, layered privacy controls
- Lightweight signals over engagement traps

### Reference Table

| Principle | Description | Signal |
|---|---|---|
| Context | Every spark carries provenance, scope, and purpose. | Source, Audience |
| Consent | Sharing & remixing is opt-in, reversible, and logged. | Grants |
| Clarity | Semantics > virality. Plain, structured metadata. | Facets |

### Deep Dive

Inspired by Medium's clean layouts, we use generous white (black) space, clear typographic hierarchy, and comfortable line lengths. Images are centered and scaled responsively. Categories and tags sit near the title for quick scanning, but the focus remains on the content.

By emphasizing visual rhythm — spacing between headings, paragraphs, and tables — readers can skim without losing context, much like reading a well-structured magazine article.

> All experiments emphasize legibility and revocability over growth-at-all-costs.
`,
};

export default function Blogs({ data: customData }) {
  const data = { ...defaultData, ...(customData || {}) };
  const [imgLoaded, setImgLoaded] = useState(!data.thumbnail);

  return (
    <div className="blog-container">
      <div className="background-layer" />
      <div className="background-accent" />

      {/* Header */}
      <div className="header-wrapper">
        <h1 className="blog-title">{data.title}</h1>
        <div className="title-underline" />
        <p className="posted-at">{data.postedAt}</p>
        <div className="category-tag-wrapper">
          {data.categories.map((c, i) => <a key={i} className="category-link" href="#">{c}</a>)}
        </div>
        <div className="category-tag-wrapper">
          {data.tags.map((t, i) => <span key={i} className="tag">{t}</span>)}
        </div>
        {data.description && <p className="blog-description">{data.description}</p>}
      </div>

      {/* Thumbnail */}
      {data.thumbnail && (
        <div className="hero-wrapper">
          <div className="hero-container">
            <figure className="hero-figure">
              <img src={data.thumbnail} alt="Thumbnail" onLoad={() => setImgLoaded(true)} />
              <div className="scrim" />
              <div className="grain" />
            </figure>
          </div>
        </div>
      )}

      {/* Markdown Content */}
      <div className="blog-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.summaryMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
