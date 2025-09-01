import React, { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { upvoteFeedback, deleteFeedback } from "./feedbackSlice";
import type { Feedback } from "./feedbackSlice";
import type { RootState } from "../../app/store";

const FeedbackList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state: RootState) => state.feedback);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [collapsed, setCollapsed] = useState<Record<"Bug" | "Feature" | "Improvement", boolean>>({
    Bug: false,
    Feature: false,
    Improvement: false,
  });

  // Filter + sort feedback
  const filteredAndSorted = useMemo(() => {
    return items
      .filter((fb) => fb.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || "").getTime();
        const dateB = new Date(b.createdAt || "").getTime();
        return sort === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [items, search, sort]);

  // Group by category
  const groups = useMemo(() => {
    const g: Record<"Bug" | "Feature" | "Improvement", Feedback[]> = {
      Bug: [],
      Feature: [],
      Improvement: [],
    };
    filteredAndSorted.forEach((fb) => g[fb.category].push(fb));
    return g;
  }, [filteredAndSorted]);

  const handleToggle = (category: "Bug" | "Feature" | "Improvement") => {
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      dispatch(deleteFeedback(id));
    }
  };

  return (
    <div className="feedback-list">
      <h2 className="section-title">Feedback Explorer</h2>

      {/* Controls */}
      <div className="controls">
        <input
          id="feedback-search"
          name="feedback-search"
          type="text"
          className="search-input"
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
        <select
          id="feedback-sort"
          name="feedback-sort"
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          disabled={loading}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {loading && <p>Loading feedback...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && filteredAndSorted.length === 0 && <p className="empty">No feedback found.</p>}

      {(["Bug", "Feature", "Improvement"] as const).map((category) => {
        const feedbacks = groups[category];
        return (
          <div key={category} className="group">
            <button
              type="button"
              className="group-header"
              onClick={() => handleToggle(category)}
              aria-expanded={!collapsed[category]}
            >
              <h3>{category} ({feedbacks.length})</h3>
              <span className="toggle">{collapsed[category] ? "➕" : "➖"}</span>
            </button>

            {!collapsed[category] && (
              <div className="group-items">
                {feedbacks.length === 0 && <p className="empty">No {category} feedback yet.</p>}

                {feedbacks.map((fb) => (
                  <div key={fb._id} className="feedback-card">
                    <h4>{fb.title}</h4>
                    <p>{fb.description}</p>
                    <p className="meta">
                      {fb.category} | {fb.upvotes ?? 0} upvotes
                    </p>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <button
                        className="btn-primary"
                        onClick={() => fb._id && dispatch(upvoteFeedback(fb._id))}
                        disabled={loading}
                      >
                        👍 {fb.upvotes ?? 0}
                      </button>
                      <button
                        className="btn-primary"
                        style={{ background: "#e31b1b" }}
                        onClick={() => fb._id && handleDelete(fb._id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FeedbackList;


