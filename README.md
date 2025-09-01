# FeedForward

A modern feedback explorer built with **React**, **TypeScript**, and **Vite**.

## Features

- Add, view, upvote, and delete feedback items
- Group feedback by category (Bug, Feature, Improvement)
- Search and sort feedback
- Toast notifications for actions
- Accessible, responsive UI
- Optional: JWT authentication for restricted actions

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
npm install
```Running the app

npm run dev

```
Building for Production

npm run build

```
linting

npm run lint

```
Project Structure


frontend/
  ├── src/
  │   ├── app/
  │   │   └── store.ts
  │   ├── features/
  │   │   └── feedback/
  │   │       ├── AddFeedback.tsx
  │   │       ├── FeedbackList.tsx
  │   │       └── feedbackSlice.ts
  │   ├── App.tsx
  │   ├── main.tsx       
  │   ├── hooks.ts
  │   ├── index.css
  │   └── index.html
  ├── public/
  ├── .gitignore
  └── README.md


VITE_API_URL=https://feedforward-backend-rdd3.onrender.com

```Environment Variables

Set your API endpoint in .env: VITE_API_URL=http://localhost:5000

Future Improvements

Fix and enhance the upvote functionality to be more reliable and responsive.

Add full TypeScript strict typing across all components and Redux slices for better type safety.

Implement more advanced accessibility features (ARIA live regions, keyboard focus management).

 Add authentication and user-specific feedback history.

```Notes

This project was entirely written by me without the use of AI tools.

Built with Vite
, React
, Redux Toolkit
, and TypeScript and css.

Coded by Eleton Masombuka