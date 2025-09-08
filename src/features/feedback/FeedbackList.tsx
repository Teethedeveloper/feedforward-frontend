import React, { useState, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  fetchFeedback,
  upvoteFeedback,
  deleteFeedback,
} from "./feedbackSlice";
import type { Feedback } from "./feedbackSlice";
import type { RootState } from "../../app/store";

const FeedbackList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(
    (state: RootState) => state.feedback
  );

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [collapsed, setCollapsed] = useState<
    Record<"Bug" | "Feature" | "Improvement", boolean>
  >({
    Bug: false,
    Feature: false,
    Improvement: false,
  });

  // Fetch feedback on mount
  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

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
        type="text"
        placeholder="Search feedback..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
        disabled={loading}
      />

      {/* Accessible select */}
      <label htmlFor="sort-select" className="sr-only">
        Sort feedback
      </label>
      <select
        id="sort-select"
        value={sort}
        onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
        className="sort-select"
        disabled={loading}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
    </div>

    {loading && <p className="loading">Loading feedback...</p>}
    {error && <p className="form-error">{error}</p>}
    {!loading && filteredAndSorted.length === 0 && (
      <p className="empty">No feedback found.</p>
    )}

    {(["Bug", "Feature", "Improvement"] as const).map((category) => {
      const feedbacks = groups[category];
      return (
        <div key={category} className="feedback-group">
          <button
            type="button"
            className="group-header"
            onClick={() => handleToggle(category)}
            aria-expanded={!collapsed[category]}
            aria-controls={`group-${category}`}
          >
            <h3>
              {category} ({feedbacks.length})
            </h3>
            <span className="toggle-icon">
              {collapsed[category] ? "➕" : "➖"}
            </span>
          </button>

          {!collapsed[category] && (
            <div id={`group-${category}`} className="group-items">
              {feedbacks.length === 0 && (
                <p className="empty">No {category} feedback yet.</p>
              )}

              {feedbacks.map((fb) => (
                <div key={fb._id} className="feedback-card">
                  <h4 className="feedback-title">{fb.title}</h4>
                  <p className="feedback-description">{fb.description}</p>
                  <p className="feedback-meta">
                    {fb.category} | {fb.upvotes ?? 0} upvotes
                  </p>
                  <div className="feedback-actions">
                    <button
                      className="btn btn-upvote"
                      onClick={() => fb._id && dispatch(upvoteFeedback(fb._id))}
                      disabled={loading}
                      aria-label={`Upvote feedback: ${fb.title}`}
                    >
                      👍 {fb.upvotes ?? 0}
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => fb._id && handleDelete(fb._id)}
                      disabled={loading}
                      aria-label={`Delete feedback: ${fb.title}`}
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


