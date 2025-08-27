import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function BlogDetails() {
  const { articleId } = useParams();
  const articleIdNum = Number(articleId); // convert to number
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const articleIds = [4839, 4840, 4841, 4842, 4843, 4844,4845,4846];

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch main blog
        const res = await fetch(
          "https://philoquent-genie-389259153114.us-central1.run.app/v1/room/article/public",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ articleId: articleIdNum }),
          }
        );

        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlogData(data.article);

        // Fetch other blogs except current one
        const otherIds = articleIds.filter((id) => id !== articleIdNum);
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

        setRelatedBlogs(results.filter(Boolean).slice(0, 6)); // limit 4 blogs
        setLoading(false);

        // Scroll to top when new blog loads
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleIdNum]);

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

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="related-blogs-section1">
          <h2>Recommended</h2>
          <div className="related-blogs-grid1">
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
