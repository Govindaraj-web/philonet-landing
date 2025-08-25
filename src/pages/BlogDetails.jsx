import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Blogs from "./Blogs";

export default function BlogDetails() {
  const { articleId } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!articleId) return;

    fetch("https://philoquent-genie-389259153114.us-central1.run.app/v1/room/article/public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Blog not found");
        return res.json();
      })
      .then(data => {
        const formattedData = {
          name: data.name || "Philonet",
          title: data.title || "Untitled Blog",
          postedAt: data.postedAt || new Date().toDateString(),
          thumbnail: data.thumbnail || "https://placehold.co/1200x600",
          description: data.description || "",
          categories: data.categories || [],
          tags: data.tags || [],
          summaryMarkdown: data.content || "No content available.",
        };
        setBlogData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [articleId]);

  if (loading) return <p style={{textAlign:"center"}}>Loading blog...</p>;
  if (error) return <h2 style={{textAlign:"center"}}>404 - Blog not found</h2>;

  return <Blogs data={blogData} />;
}
