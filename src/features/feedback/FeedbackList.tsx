import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { upvoteFeedback, deleteFeedback } from "./feedbackSlice";
import type { Feedback } from "./feedbackSlice";
import type { RootState } from "../../app/store";

const FeedbackList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state: RootState) => state.feedback);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    Bug: false,
    Feature: false,
    Improvement: false,
  });

  // Search + sort
  const filtered = items.filter((fb: Feedback) =>
    fb.title.toLowerCase().includes(search.toLowerCase())
  );

  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt || "").getTime();
    const dateB = new Date(b.createdAt || "").getTime();
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Group by category
  const groups: Record<string, Feedback[]> = { Bug: [], Feature: [], Improvement: [] };
  filtered.forEach((fb) => groups[fb.category].push(fb));

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
      {!loading && filtered.length === 0 && <p className="empty">No feedback found.</p>}

      {Object.entries(groups).map(([category, feedbacks]) => (
        <div key={category} className="group">
          <div
            className="group-header"
            onClick={() => setCollapsed({ ...collapsed, [category]: !collapsed[category] })}
          >
            <h3>{category} ({feedbacks.length})</h3>
            <span className="toggle">{collapsed[category] ? "➕" : "➖"}</span>
          </div>

          <div className={`group-items ${collapsed[category] ? "collapsed" : ""}`}>
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
                    onClick={() => fb._id && dispatch(deleteFeedback(fb._id))}
                    disabled={loading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;

