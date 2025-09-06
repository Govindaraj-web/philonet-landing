import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Search,
  Globe,
  Star,
  MoreHorizontal,
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
  Trophy,
  Clapperboard,
  HeartPulse,
  BookOpen,
  Airplay,
  Shield,
  Flag,
  Brain,
  Receipt,
  Utensils,
  Megaphone,
  Leaf
} from "lucide-react";

import "./NewsFeed.css";

const topics = [
  "Top stories", "World", "Politics", "Artificial", "Business", "Technology", "Health", "Finance", "Cricket", "Social", "Historical","Entertainment", "Transportation", "Education", "Food", "Environment",
];

const icons = {
  World: <Globe className="icon" />,
  Politics: <Flag className="icon" />,
  Artificial: <Brain className="icon" />,
  Business: <Briefcase className="icon" />,
  Technology: <Cpu className="icon" />,
  Health: <HeartPulse className="icon" />,
  Finance: <Receipt className="icon" />,
  Cricket: <Trophy className="icon" />,
  Social: <Megaphone className="icon" />,
  Historical: <Shield className="icon" />,
  Entertainment: <Clapperboard className="icon" />,
  Transportation: <Airplay className="icon" />,
  Education: <BookOpen className="icon" />,
  Food: <Utensils className="icon" />,
  Environment: <Leaf className="icon" />,
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

// Helper function to get random sample of articles
function getRandomArticles(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function NewsFeed() {
  const [allArticles, setAllArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState("Top stories");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [quickPicks, setQuickPicks] = useState([]);

  const articleRefs = useRef({});
  const loader = useRef(null);
  const scrollPositions = useRef({});

  const API_URL = "https://philoquent-genie-389259153114.us-central1.run.app/v1/room/public/feedArticles?sort_by=trending&limit=10";

  const mapArticles = (items) => {
    return items.map((item) => {
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
  };

  const fetchArticles = useCallback(async (pageToFetch) => {
    setIsFetchingMore(true);
    try {
      const res = await fetch(`${API_URL}&page=${pageToFetch}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.articles)) {
        const mapped = mapArticles(data.articles);
        if (mapped.length === 0) {
          setHasMore(false);
        }

        setAllArticles(prev => {
          const newArticleIds = new Set(prev.map(a => a.id));
          const uniqueNewArticles = mapped.filter(a => !newArticleIds.has(a.id));
          return [...prev, ...uniqueNewArticles];
        });

        setVisibleArticles(prev => {
          const newArticleIds = new Set(prev.map(a => a.id));
          const uniqueNewArticles = mapped.filter(a => !newArticleIds.has(a.id));
          return [...prev, ...uniqueNewArticles];
        });

        setPage(pageToFetch);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles(1);
  }, [fetchArticles]);


  
  useEffect(() => {
    if (searchQuery !== "" || activeTopic !== "Top stories" || !hasMore || loading || isFetchingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchArticles(page + 1);
      },
      { root: null, rootMargin: "20px", threshold: 1.0 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => loader.current && observer.unobserve(loader.current);
  }, [hasMore, loading, isFetchingMore, searchQuery, page, activeTopic, fetchArticles]);

  useEffect(() => {
    setQuickPicks(getRandomArticles(visibleArticles, 10));
  }, [visibleArticles]);

  const handleTopicClick = (topic) => {
    // Save current scroll
    scrollPositions.current[activeTopic] = window.scrollY;

    if (topic === activeTopic && searchQuery === "") return;

    setActiveTopic(topic);
    setSearchQuery("");

    if (topic === "Top stories") {
      setHasMore(true);
      if (allArticles.length === 0) {
        setLoading(true);
        fetchArticles(1);
      } else {
        setVisibleArticles(allArticles);
        setLoading(false);
      }

      // Restore scroll
      setTimeout(() => {
        if (scrollPositions.current[topic] !== undefined) {
          window.scrollTo({ top: scrollPositions.current[topic], behavior: "auto" });
        }
      }, 50);

      return;
    }

    setHasMore(false);
    setLoading(true);

    const filtered = allArticles.filter(a =>
      a.source.toLowerCase().includes(topic.toLowerCase())
    );

    if (filtered.length === 0) {
      setAllArticles([]);
      setVisibleArticles([]);
      setLoading(true);
      const fetchAndFilter = async () => {
        try {
          const res = await fetch(`${API_URL}&page=1`);
          const data = await res.json();
          if (data.success && Array.isArray(data.articles)) {
            const mapped = mapArticles(data.articles);
            setAllArticles(mapped);
            const filteredMapped = mapped.filter(a =>
              a.source.toLowerCase().includes(topic.toLowerCase())
            );
            setVisibleArticles(filteredMapped);
          }
        } catch (err) {
          console.error("Error fetching or filtering:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAndFilter();
    } else {
      setVisibleArticles(filtered);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setActiveTopic("");
    setHasMore(false);
    setLoading(true);

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
    setLoading(false);
  };

  const scrollToArticle = (id) => {
    const el = articleRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    //  Top Content 
    <div className="page-container">
      <div className="content-wrapper">
        <header className="header">
          <div className="header-top">
            <img src="/philonet.png" alt="AI_Logo" className="flame-icon1" style={{ cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            <div className="logo-text">Philonet Public</div>
            <span className="preview-badge">Preview</span>
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Explore news by category, business, politics…"
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

        {/* main content  */}
        <main className="main-grid">
          <section className="articles-list">
            {loading && !isFetchingMore && visibleArticles.length === 0 &&
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            }

            {!loading && visibleArticles.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                No articles found for "{activeTopic || searchQuery}".
              </div>
            )}

            {visibleArticles.map((a, index) => (
              <article
                key={`${a.id}-${index}`}
                className="article-card fade-slide-up"
                ref={(el) => (articleRefs.current[a.id] = el)}
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

                    <div className="article-image-wrapper" id="mobileview">
                      <div className="image-overlay" />
                      <img
                        src={a.image || "/default.png"}
                        alt="Article visual"
                        className="article-image"
                        loading="eager"
                        onClick={() => window.open(a.url, "_blank")}
                        onError={(e) => (e.target.src = "/default.png")}
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

                  <div className="article-image-wrapper" id="laptopview">
                    <div className="image-overlay" />
                    <img
                      src={a.image || "/default.png"}
                      alt="Article visual"
                      className="article-image"
                      loading="eager"
                      onClick={() => window.open(a.url, "_blank")}
                      onError={(e) => (e.target.src = "/default.png")}
                    />
                  </div>
                </div>
              </article>
            ))}

            {isFetchingMore && hasMore &&
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            }

            {!hasMore && !loading && (
              <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                <p>You've reached the end of the news feed.</p>
              </div>
            )}

            <div ref={loader} style={{ height: "1px", visibility: "hidden" }} />
          </section>

          {/* Side Bar nav */}
          <div id="mobilesidebarhidden">
            <aside className="sidebar">
              <div className="quick-picks">
                <h3>Quick Picks</h3>
                <ul>
                  {quickPicks.map((a, i) => (
                    <li
                      key={`${a.id}-${i}`}
                      className="quick-pick-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => scrollToArticle(a.id)}
                    >
                      <span className="qp-title">{a.title}</span>
                      <div className="qp-meta">
                        <span>{a.source}</span> · <span>{a.age}</span>
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

export default NewsFeed;
    