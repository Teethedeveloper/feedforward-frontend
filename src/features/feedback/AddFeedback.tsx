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

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle || !trimmedDesc) {
      setLocalError("All fields are required");
      toast.error("Please fill in all fields");
      return;
    }

    // Optimistically reset form
    setTitle("");
    setDescription("");
    setCategory("Bug");
    setLocalError("");

    try {
      await dispatch(
        addFeedback({ title: trimmedTitle, description: trimmedDesc, category })
      ).unwrap();
      toast.success("Feedback submitted!");
    } catch (err) {
      console.error(err);
      setLocalError("Failed to submit feedback");
      toast.error("Something went wrong");
    }
  };

  const isSubmitDisabled = loading || !title.trim() || !description.trim();

  return (
  <form className="feedback-form" onSubmit={handleSubmit} aria-busy={loading}>
    <h2 className="form-title">Add Feedback</h2>

    {(localError || error) && <p className="form-error">{localError || error}</p>}

    {/* Title */}
    <div className="form-group">
      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter feedback title"
        disabled={loading}
        required
        maxLength={100}
      />
    </div>

    {/* Description */}
    <div className="form-group">
      <label htmlFor="desc">Description</label>
      <textarea
        id="desc"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the feedback..."
        disabled={loading}
        required
        maxLength={500}
      />
    </div>

    {/* Category */}
    <div className="form-group">
      <label htmlFor="cat">Category</label>
      <select
        id="cat"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value as "Bug" | "Feature" | "Improvement")
        }
        disabled={loading}
        required
      >
        <option value="">Select category</option>
        <option value="Bug">Bug</option>
        <option value="Feature">Feature</option>
        <option value="Improvement">Improvement</option>
      </select>
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="btn-primary"
      disabled={isSubmitDisabled}
      aria-busy={loading}
    >
      {loading ? (
        <span className="spinner" aria-label="Submitting..."></span>
      ) : (
        "Submit Feedback"
      )}
    </button>
  </form>
);

};

export default AddFeedback;


