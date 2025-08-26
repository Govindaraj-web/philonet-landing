import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // <-- import
import "./Blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const articleIds = [4839, 4840, 4841, 4842, 4843, 4844];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const results = await Promise.all(
          articleIds.map(async (id) => {
            const res = await fetch(
              "https://philoquent-genie-389259153114.us-central1.run.app/v1/room/article/public",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleId: id }),
              }
            );
            if (!res.ok) throw new Error(`Blog ${id} not found`);
            const data = await res.json();
            return data.article;
          })
        );

        setBlogs(results.filter(Boolean));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );

  if (error)
    return (
      <div className="error">
        Error: {error}
      </div>
    );


  return (
    <>
      <Helmet>
        <title>Blogs | Philonet</title>
        <meta name="description" content="Read the latest blogs on design, technology, and social systems by Philonet." />
        <meta name="keywords" content="Philonet, Blogs, Design, Technology, Social Systems" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="blogs-container">
        {blogs.slice(0, 6).map((blog) => (
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
                  ? blog.summary.slice(0, 120) + "..."
                  : "No summary available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
