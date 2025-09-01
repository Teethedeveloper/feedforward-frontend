import { configureStore } from "@reduxjs/toolkit";
import feedbackReducer from "../features/feedback/feedbackSlice";

export const store = configureStore({
  reducer: {
    feedback: feedbackReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
