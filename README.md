# BackTrack Campus Find

An in-repo lost & found app with a React frontend and a Node/Express backend. This README reflects the actual codebase in this repository: a Vite + React frontend and a local Express backend (with Socket.IO and JWT auth). The backend uses in-memory stores for demo data.

## Live / Demos
- Live Demo: (not configured)
- Demo Video: (not configured)

## Tech Snapshot
- **Frontend:** React (JSX) • Vite • Tailwind CSS • socket.io-client
- **Backend:** Node.js • Express • Socket.IO • JWT auth (in-memory users) • bcryptjs

## Notable Implementation Details
- Authentication is implemented in `Backend/routes/auth.js` using JWT tokens and an in-memory `users` array (`Backend/models/User.js`).
- Real-time notifications and chat are implemented with Socket.IO in `Backend/server.js` and `socket.io-client` on the frontend.
- The backend currently stores items, chats, notifications and messages in memory (arrays in `server.js`) — suitable for local development and demos, not production.
- There is a heuristic AI-style matching function (`calculateMatchScore`) inside `Backend/server.js` that computes similarity scores between lost and found items.

## Project Structure
- `Frontend/` — Vite React app
  - `Frontend/src/main.jsx` — app entry
  - `Frontend/src/App.jsx` — client-side routing/page state
  - `Frontend/src/components/` — UI components (Header, ItemCard, ChatPage, AdminDashboard, etc.)
- `Backend/` — Express API and Socket.IO server
  - `Backend/server.js` — API routes, Socket.IO, AI matching logic
  - `Backend/routes/auth.js` — register/login/me endpoints (JWT)
  - `Backend/middleware/auth.js` — `authMiddleware` and `adminMiddleware`
  - `Backend/models/User.js` — simple in-memory user functions

## Prerequisites
- Node.js v18+ (recommended)
- npm or yarn

## Installation (local dev)
Clone the repo and install dependencies for both frontend and backend:

```powershell
git clone https://github.com/your-username/your-repo.git
cd your-repo

cd Frontend
npm install

cd ../Backend
npm install
```

## Running Locally

Start the backend (default port 3001):

```powershell
cd Backend
npm run dev
```

Start the frontend (Vite dev server):

```powershell
cd Frontend
npm run dev
```

The frontend connects to the backend at `http://localhost:3001` by default (see `Frontend/src/App.jsx`).

## Environment & Secrets
- The backend uses a hard-coded JWT secret in `Backend/middleware/auth.js` and `Backend/routes/auth.js` (`your-secret-key-change-in-production`). **Change this before any public deployment.**
- For production you should replace the in-memory stores with a persistent database (Postgres, MongoDB, etc.) and store secrets in environment variables.

## API Highlights
- `POST /api/auth/register` — Register new user (returns JWT)
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/me` — Get current user data (requires `Authorization: Bearer <token>`) 
- `GET /api/items` — Public lost items
- `POST /api/items` — Create item (requires auth)
- Admin endpoints exist under `/api/admin/*` to approve/reject matches and manage items (protected by `adminMiddleware`).

## Notes & Next Steps
- This repository ships a working demo that is suitable for local testing and prototyping.
- Recommended improvements for production:
  - Replace in-memory storage with a database (e.g., Postgres, Supabase, or MongoDB)
  - Move JWT secret to environment variables and add HTTPS
  - Add persistent file storage for item images
  - Replace demo authentication with hashed passwords (bcrypt is installed but currently plain passwords are stored) and add email verification

## Contributing
Open issues or pull requests — happy to accept improvements. If you'd like, I can:
- Update the README links (Live Demo / Video / GitHub) with real URLs
- Replace in-memory users with a simple Postgres or SQLite integration
- Add environment variable support for secrets and ports

---

Built with ❤️ — local demo by the repository author.
# lost-and-found-items
AI-based Lost &amp; Found Platform for College Campuses
