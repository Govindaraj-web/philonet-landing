import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  Globe,
  Flame,
  Star,
  MoreHorizontal,
  Loader2,
  Tag as TagIcon,
  Newspaper,
  Clock,
  UserCircle,
  MessageCircle,
  Repeat2,
  Heart,
  BarChart3,
  Cpu,
  Briefcase,
  FlaskConical,
  Trophy,
  Clapperboard,
  HeartPulse,
  MapPin,
  Bell,
  BookOpen,
  Camera,
  Film,
  Music,
  ShoppingCart,
  Wifi,
  Zap,
  Coffee,
  Anchor,
  Airplay,
  Award,
  Battery,
  Code,
} from "lucide-react";

import "./PhilonetNewsFeed.css";

const topics = [
  "Top stories", "India", "World", "Business", "Technology", "Science", "Sports",
  "Entertainment", "Health", "Travel", "Education", "Finance", "Lifestyle", "Music",
  "Movies", "Gaming", "Food", "Art", "Environment", "Politics", "Weather",
  "Startups", "Culture",
];

const icons = {
  India: <MapPin className="icon" />,
  World: <Globe className="icon" />,
  Business: <Briefcase className="icon" />,
  Technology: <Cpu className="icon" />,
  Science: <FlaskConical className="icon" />,
  Sports: <Trophy className="icon" />,
  Entertainment: <Clapperboard className="icon" />,
  Health: <HeartPulse className="icon" />,
  Travel: <Airplay className="icon" />,
  Education: <BookOpen className="icon" />,
  Finance: <ShoppingCart className="icon" />,
  Lifestyle: <Coffee className="icon" />,
  Music: <Music className="icon" />,
  Movies: <Film className="icon" />,
  Gaming: <Zap className="icon" />,
  Food: <Camera className="icon" />,
  Art: <Award className="icon" />,
  Environment: <Code className="icon" />,
  Politics: <Bell className="icon" />,
  Weather: <Battery className="icon" />,
  Startups: <Code className="icon" />,
  Culture: <Anchor className="icon" />,
};

const topicIcon = (t) => icons[t] || <Star className="icon" />;

const SkeletonCard = () => (
  <div className="article-card fade-slide-up" style={{ height: "260px" }}>
    <div className="article-grid">
      <div className="article-content">
        <div className="article-meta skeleton-line" />
        <div className="skeleton-line" style={{ width: "80%", height: "20px" }} />
        <div className="skeleton-box" style={{ height: "100px" }} />
        <div className="skeleton-line" style={{ width: "90%", height: "14px" }} />
      </div>
      <div className="skeleton-box" style={{ height: "150%", width: "100%" }} />
    </div>
  </div>
);

function PhilonetNewsFeed() {
  const [allArticles, setAllArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("Top stories");
  const [searchQuery, setSearchQuery] = useState("");

  // Refs for scrolling
  const articleRefs = useRef({});

  const API_URL =
    "https://philoquent-genie-389259153114.us-central1.run.app/v1/room/public/feedArticles?sort_by=trending&page=1&limit=10";

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (data.success && Array.isArray(data.articles)) {
          const mapped = data.articles.map((item) => {
            const a = item.article;
            const seconds = Math.floor((new Date() - new Date(a.created_at)) / 1000);
            const age =
              seconds < 60
                ? `${seconds} sec ago`
                : seconds < 3600
                  ? `${Math.floor(seconds / 60)} min ago`
                  : seconds < 86400
                    ? `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? "s" : ""} ago`
                    : seconds < 2592000
                      ? `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? "s" : ""} ago`
                      : seconds < 31104000
                        ? `${Math.floor(seconds / 2592000)} month${Math.floor(seconds / 2592000) > 1 ? "s" : ""} ago`
                        : `${Math.floor(seconds / 31104000)} year${Math.floor(seconds / 31104000) > 1 ? "s" : ""} ago`;

            return {
              id: a.id,
              title: a.title,
              summary: a.summary,
              url: a.url,
              source: a.category || "Philonet News",
              age: age,
              image: a.thumbnail_url,
              tag: a.tags?.[0] || "General",
              postedBy: item.shared_by?.name || "Anonymous",
              picture: item.shared_by?.picture || null,
              likes: Math.floor(Math.random() * 500),
              retweets: Math.floor(Math.random() * 100),
              comments: a.comment_count || 0,
              views: Math.floor(500 + Math.random() * 2000),
            };
          });

          setAllArticles(mapped);
          setVisibleArticles(mapped);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleTopicClick = (topic) => {
    setActiveTopic(topic);
    setSearchQuery("");
    if (topic === "Top stories") {
      setVisibleArticles(allArticles);
    } else {
      const filtered = allArticles.filter((a) =>
        a.source.toLowerCase().includes(topic.toLowerCase())
      );
      setVisibleArticles(filtered);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      handleTopicClick(activeTopic);
      return;
    }

    const filtered = allArticles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.summary.toLowerCase().includes(query.toLowerCase()) ||
          a.source.toLowerCase().includes(query.toLowerCase()) ||
          a.tag.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.views - a.views);

    setVisibleArticles(filtered);
  };

  const scrollToArticle = (id) => {
    const el = articleRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-top">
            <Flame className="flame-icon" />
            <div className="logo-text">Philonet Public</div>
            <span className="preview-badge">Preview</span>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search topics, sources, places…"
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Search className="search-icon" />
              <kbd className="search-key">/</kbd>
            </div>
          </div>
          <nav className="nav">
            <ul className="topic-list">
              {topics.map((t) => (
                <li key={t}>
                  <button
                    className={`topic-btn ${activeTopic === t ? "active" : ""}`}
                    onClick={() => handleTopicClick(t)}
                  >
                    {topicIcon(t)}
                    <span>{t}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Main */}
        <main className="main-grid">
          {/* Articles */}
          <section className="articles-list">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}

            {!loading &&
              visibleArticles.map((a) => (
                <article
                  key={a.id}
                  className="article-card fade-slide-up"
                  ref={(el) => (articleRefs.current[a.id] = el)} // Attach ref
                >
                  <div className="article-grid">
                    <div className="article-content">
                      <div className="article-meta">
                        <span className="tag">
                          <TagIcon className="icon-small" /> {a.tag}
                        </span>
                        <span className="source">
                          <Newspaper className="icon-small" /> {a.source}
                        </span>
                        <span className="time">
                          <Clock className="icon-small" /> {a.age}
                        </span>
                        <span className="author">
                          {a.picture ? (
                            <img
                              src={a.picture}
                              alt={a.postedBy}
                              className="icon-small"
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginRight: "6px",
                              }}
                            />
                          ) : (
                            <UserCircle className="icon-small" />
                          )}
                          {a.postedBy}
                        </span>
                      </div>

                      <h2
                        className="article-title"
                        onClick={() => window.open(a.url, "_blank")}
                        style={{ cursor: "pointer" }}
                      >
                        {a.title}
                      </h2>

                      <div className="article-image-wrapper" id="mobileshow">
                        <div className="image-overlay" />
                        <img
                          src={a.image}
                          alt="Article visual"
                          className="article-image"
                          loading="lazy"
                          onClick={() => window.open(a.url, "_blank")}
                        />
                      </div>

                      <p className="article-summary">{a.summary}</p>

                      <div className="article-reactions">
                        <div className="reactions-left">
                          <span className="reaction comment">
                            <MessageCircle className="icon" /> {a.comments}
                          </span>
                          <span className="reaction retweet">
                            <Repeat2 className="icon" /> {a.retweets}
                          </span>
                          <span className="reaction like">
                            <Heart className="icon" /> {a.likes}
                          </span>
                          <span className="reaction views">
                            <BarChart3 className="icon" /> {a.views}
                          </span>
                        </div>
                        <button className="more-btn">
                          <MoreHorizontal className="icon" />
                        </button>
                      </div>
                    </div>

                    <div className="article-image-wrapper" id="mobilehidden">
                      <div className="image-overlay" />
                      <img
                        src={a.image}
                        alt="Article visual"
                        className="article-image"
                        loading="lazy"
                        onClick={() => window.open(a.url, "_blank")}
                      />
                    </div>
                  </div>
                </article>
              ))}
          </section>

          {/* Sidebar */}
          <div id="mobilesidebarhidden">
            <aside className="sidebar">
              <div className="quick-picks">
                <h3>Quick Picks</h3>
                <ul>
                  {visibleArticles.map((a, i) => (
                    <li
                      key={i}
                      className="quick-pick-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => scrollToArticle(a.id)} // Scroll to article
                    >
                      <span className="qp-title">{a.title}</span>
                      <div className="qp-meta">
                        <span>{a.source}</span> · <span>{a.age} ago</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PhilonetNewsFeed;
