import React, { useEffect, useState } from "react";
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
  "Top stories",
  "India",
  "World",
  "Business",
  "Technology",
  "Science",
  "Sports",
  "Entertainment",
  "Health",
  "Travel",
  "Education",
  "Finance",
  "Lifestyle",
  "Music",
  "Movies",
  "Gaming",
  "Food",
  "Art",
  "Environment",
  "Politics",
  "Weather",
  "Startups",
  "Culture",
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
  Environment: <Code className="icon" />, // replaced Cloud to Code for import correctness
  Politics: <Bell className="icon" />,
  Weather: <Battery className="icon" />,
  Startups: <Code className="icon" />,
  Culture: <Anchor className="icon" />,
};

const topicIcon = (t) => icons[t] || <Star className="icon" />;

function PhilonetNewsFeed() {
  const [visibleArticles, setVisibleArticles] = useState([]);
  const [loading, setLoading] = useState(true);

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

          // Directly set articles to avoid blink
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
              />
              <Search className="search-icon" />
              <kbd className="search-key">/</kbd>
            </div>
          </div>
          <nav className="nav">
            <ul className="topic-list">
              {topics.map((t, idx) => (
                <li key={t}>
                  <button className={`topic-btn ${idx === 0 ? "active" : ""}`}>
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
            {loading && (
              <div className="loading">
                <Loader2 className="spinner" />
                <span>Fetching stories…</span>
              </div>
            )}

            {!loading &&
              visibleArticles.map((a) => (
                <article key={a.id} className="article-card fade-slide-up">
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

                      <h2 className="article-title">{a.title}</h2>

                      <div className="article-image-wrapper" id="mobileshow">
                        <div className="image-overlay" />
                        <img
                          src={a.image}
                          alt="Article visual"
                          className="article-image"
                          loading="lazy"
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
                    <li key={i} className="quick-pick-item">
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
