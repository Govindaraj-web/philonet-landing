// BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function BlogDetails() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(
          "https://philoquent-genie-389259153114.us-central1.run.app/v1/room/article/public",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ articleId }),
          }
        );
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlogData(data.article);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

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

  if (!blogData) return null;

  return (
    <div className="blog-details-wrapper">
      <button onClick={() => navigate("/")} className="back-home-btn">
        <span className="arrow">⬅</span>
        <span className="text">Back to Home</span>
      </button>
      <div className="blog-details-page">
        {blogData.thumbnail_url && (
          <div className="thumbnail-wrapper">
            <img
              src={blogData.thumbnail_url}
              alt={blogData.title}
              className="blog-details-thumbnail"
            />
          </div>
        )}
        <h1 className="blog-title">{blogData.title}</h1>
        <p className="blog-summary">{blogData.summary}</p>
        <div className="blog-content1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blogData.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
