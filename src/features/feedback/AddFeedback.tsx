import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addFeedback } from "./feedbackSlice";
import toast from "react-hot-toast";
import type { RootState } from "../../app/store";

const AddFeedback: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state: RootState) => state.feedback);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Bug" | "Feature" | "Improvement">("Bug");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setLocalError("All fields are required");
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await dispatch(addFeedback({ title, description, category })).unwrap();
      setTitle("");
      setDescription("");
      setCategory("Bug");
      setLocalError("");
      toast.success("Feedback submitted!");
    } catch (err) {
      console.error(err)
      setLocalError("Failed to submit feedback");
      toast.error("Something went wrong");
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add Feedback</h2>

      {(localError || error) && <p className="form-error">{localError || error}</p>}

      <div className="form-group">
        <label htmlFor="title">Title </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter feedback title"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="desc">Description </label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the feedback..."
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cat">Category </label>
        <select
          id="cat"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as "Bug" | "Feature" | "Improvement")
          }
          disabled={loading}
          title="Select feedback category"
        >
          <option value="Bug">Bug</option>
          <option value="Feature">Feature</option>
          <option value="Improvement">Improvement</option>
        </select>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          <span className="spinner"></span>
        ) : (
          "Submit Feedback"
        )}
      </button>
    </form>
  );
};

export default AddFeedback;

