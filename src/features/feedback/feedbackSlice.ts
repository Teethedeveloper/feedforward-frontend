import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://feedforward-backend-rdd3.onrender.com";

export interface Feedback {
  _id?: string;
  title: string;
  description: string;
  category: "Bug" | "Feature" | "Improvement";
  createdAt?: string;
  upvotes?: number;
}

interface FeedbackState {
  items: Feedback[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all feedback
export const fetchFeedback = createAsyncThunk<Feedback[]>(
  "feedback/fetch",
  async () => {
    const res = await axios.get<Feedback[]>(`${API_URL}/feedback`);
    return res.data;
  }
);

// Add feedback
export const addFeedback = createAsyncThunk<
  Feedback,
  Omit<Feedback, "_id" | "createdAt" | "upvotes">
>("feedback/add", async (newFeedback) => {
  const res = await axios.post<Feedback>(`${API_URL}/feedback`, newFeedback);
  return res.data;
});

// Upvote feedback
export const upvoteFeedback = createAsyncThunk<Feedback, string>(
  "feedback/upvote",
  async (id) => {
    const res = await axios.patch<Feedback>(`${API_URL}/feedback/${id}/upvote`);
    return res.data;
  }
);

// Delete feedback
export const deleteFeedback = createAsyncThunk<string, string>(
  "feedback/delete",
  async (id) => {
    await axios.delete(`${API_URL}/feedback/${id}`);
    return id;
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching feedback";
      })
      // add
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // upvote
      .addCase(upvoteFeedback.fulfilled, (state, action) => {
        const idx = state.items.findIndex((fb) => fb._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // delete
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter((fb) => fb._id !== action.payload);
      });
  },
});

export default feedbackSlice.reducer;

