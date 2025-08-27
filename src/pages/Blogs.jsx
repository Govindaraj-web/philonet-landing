import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Blogs.css";

export default function Blogs() {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const articleIds = [4839, 4840, 4841, 4842, 4843];

  useEffect(() => {
    const fetchRandomBlog = async () => {
      try {
        const randomId =
          articleIds[Math.floor(Math.random() * articleIds.length)];
        const res = await fetch(
          "https://philoquent-genie-389259153114.us-central1.run.app/v1/room/article/public",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ articleId: randomId }),
          }
        );

        if (!res.ok) throw new Error(`Blog ${randomId} not found`);
        const data = await res.json();
        setBlog(data.article);

        // fetch other blogs
        const otherIds = articleIds.filter((id) => id !== randomId);
        const results = await Promise.all(
          otherIds.map(async (id) => {
            const res = await fetch(
              "https://philoquent-genie-389259153114.us-central1.run.app/v1/room/article/public",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleId: id }),
              }
            );
            if (!res.ok) return null;
            const data = await res.json();
            return data.article;
          })
        );
        setRelatedBlogs(results.filter(Boolean).slice(0, 4));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRandomBlog();
  }, []);

  if (loading)
    return (
      <div className="loading1">
        <div className="spinner1"></div>
      </div>
    );

  if (error)
    return (
      <div className="error1">
        Error: {error}
      </div>
    );
  if (!blog) return null;

  const categories = blog.categories || ["Uncategorized"];
  const tags = blog.tags || [];
  const summaryMarkdown = blog.content || "No content available";

  return (
    <div className="blog-container">
      <div className="background-layer" />
      <div className="background-accent" />

      {/* Header */}
      <div className="header-wrapper">
        <h1 className="blog-title">{blog.title}</h1>
        <div className="title-underline" />
        <p className="posted-at">{blog.posted_at}</p>
        <div className="category-tag-wrapper">
          {categories.map((c, i) => (
            <a key={i} className="category-link" href="#">
              {c}
            </a>
          ))}
        </div>
        <div className="category-tag-wrapper">
          {tags.map((t, i) => (
            <span key={i} className="tag">
              {t}
            </span>
          ))}
        </div>
        {blog.summary && <p className="blog-description">{blog.summary}</p>}
      </div>

      {/* Thumbnail (medium size) */}
      {blog.thumbnail_url && (
        <div
          className="hero-wrapper hero-medium"
          onClick={() => navigate(`/blogs/${blog.article_id}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="hero-container hero-medium-container">
            <figure className="hero-figure hero-medium-figure">
              <img
                src={blog.thumbnail_url}
                alt={blog.title}
                onLoad={() => setImgLoaded(true)}
              />
              <div className="scrim" />
              <div className="grain" />
            </figure>
          </div>
        </div>
      )}

      {/* Markdown Content */}
      <div className="blog-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {summaryMarkdown}
        </ReactMarkdown>
      </div>

      {/* Other Blogs Section */}
      {relatedBlogs.length > 0 && (
        <div className="related-blogs-section">
          <h2>Recommended</h2>
          <div className="related-blogs-grid">
            {relatedBlogs.map((blog) => (
              <div
                key={blog.article_id}
                className="blog-card"
                onClick={() => navigate(`/blogs/${blog.article_id}`)}
              >
                {blog.thumbnail_url && (
                  <img
                    src={blog.thumbnail_url}
                    alt={blog.title}
                    className="blog-thumbnail"
                  />
                )}
                <div className="blog-content">
                  <h3>{blog.title || "Untitled Blog"}</h3>
                  <p>
                    {blog.summary
                      ? blog.summary.slice(0, 100) + "..."
                      : "No summary available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
