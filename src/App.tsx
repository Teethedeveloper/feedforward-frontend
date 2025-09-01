import { useState, useEffect } from "react";
import AddFeedback from "./features/feedback/AddFeedback";
import FeedbackList from "./features/feedback/FeedbackList";
import { Toaster } from "react-hot-toast";
import { useAppDispatch } from "./hooks";
import { fetchFeedback } from "./features/feedback/feedbackSlice";

function App() {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();

  // Fetch feedback on mount
  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  return (
    <div className="app-container">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '2px solid #232120',
            borderRadius: '32px',
            padding: '1rem 1.5rem',
            fontFamily: '"Hanken Grotesk", sans-serif',
            boxShadow: 'inset 0 0 32px rgba(255,255,255,0.05)',
          },
          success: {
            iconTheme: {
              primary: '#ec66c6',
              secondary: '#1a1a1a',
            },
          },
          error: {
            iconTheme: {
              primary: '#e31b1b',
              secondary: '#1a1a1a',
            },
          },
        }}
      />
      <header className="app-header">
        <div className="branding">
          <h1 className="title">FeedForward</h1>
          <p className="tagline">feedback, but forward</p>
        </div>
      </header>
      <main className="main-content">
        {!showForm ? (
          <div className="home-page">
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
              aria-label="Add Feedback"
              title="Add Feedback"
            >
              ➕ Add Feedback
            </button>
            <FeedbackList />
          </div>
        ) : (
          <section className="add-feedback-section">
            <AddFeedback />
            <button
              className="btn-primary"
              onClick={() => setShowForm(false)}
              aria-label="Back to Home"
              title="Back to Home"
              style={{ marginTop: "1rem" }}
            >
              ← Back
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
