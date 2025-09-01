import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Use VITE_API_URL in .env or default to deployed backend
const API_URL =
  import.meta.env.VITE_API_URL || "https://feedforward-backend-rdd3.onrender.com";

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

// Axios instance with credentials (if backend uses cookies/auth)
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

// Fetch all feedback
export const fetchFeedback = createAsyncThunk<Feedback[]>(
  "feedback/fetch",
  async () => {
    const res = await axiosInstance.get<Feedback[]>("/feedback");
    return res.data;
  }
);

// Add feedback
export const addFeedback = createAsyncThunk<
  Feedback,
  Omit<Feedback, "_id" | "createdAt" | "upvotes">
>("feedback/add", async (newFeedback) => {
  const res = await axiosInstance.post<Feedback>("/feedback", newFeedback);
  return res.data;
});

// Upvote feedback
export const upvoteFeedback = createAsyncThunk<Feedback, string>(
  "feedback/upvote",
  async (id) => {
    const res = await axiosInstance.patch<Feedback>(`/feedback/${id}/upvote`);
    return res.data;
  }
);

// Delete feedback
export const deleteFeedback = createAsyncThunk<string, string>(
  "feedback/delete",
  async (id) => {
    await axiosInstance.delete(`/feedback/${id}`);
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
        state.items = action.payload.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching feedback";
      })
      // add
      .addCase(addFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add feedback";
      })
      // upvote (optimistic)
      .addCase(upvoteFeedback.pending, (state, action) => {
        const fb = state.items.find((fb) => fb._id === action.meta.arg);
        if (fb) fb.upvotes = (fb.upvotes ?? 0) + 1;
      })
      .addCase(upvoteFeedback.rejected, (state, action) => {
        state.error = action.error.message || "Failed to upvote";
      })
      // delete (optimistic)
      .addCase(deleteFeedback.pending, (state, action) => {
        state.items = state.items.filter((fb) => fb._id !== action.meta.arg);
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete feedback";
      });
  },
});

export default feedbackSlice.reducer;


