# SocialSync

A full-stack Instagram-inspired social media platform where users can share photos, follow each other, and interact with posts in real time.

![SocialSync](https://img.shields.io/badge/SocialSync-Social%20Media%20App-f97316?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)

---

## Features

- **Authentication** — Register, login, and logout with JWT-based cookie sessions
- **Posts** — Create posts with image uploads, view a personalized feed
- **Likes** — Like and unlike posts with live like counts
- **Follow System** — Send follow requests, accept or reject them, view followers and following lists
- **Profile** — Update username, email, bio, password, and profile photo
- **Image Uploads** — Powered by ImageKit CDN for fast, optimized image delivery
- **Protected Routes** — Auth-gated pages with seamless redirect handling

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Stateless authentication via HTTP-only cookies |
| bcryptjs | Password hashing |
| ImageKit | Cloud image storage and delivery |
| Multer | Multipart file upload handling (memory storage) |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite | Build tool and dev server |
| React Router v7 | Client-side routing with protected/public route guards |
| Axios | HTTP client with cookie credential support |
| SCSS | Modular component styles |
| Context API | Global auth and post state management |

---

## Project Structure

```
socialsync/
├── Backend/
│   ├── server.js                  # Entry point — connects DB then starts Express
│   ├── public/                    # Built frontend files served by Express
│   └── src/
│       ├── app.js                 # Express app setup, middleware, routes
│       ├── config/
│       │   └── Db.js              # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controllers.js
│       │   ├── post.controller.js
│       │   └── user.controller.js
│       ├── middlewares/
│       │   └── auth.middleware.js  # JWT verification middleware
│       ├── models/
│       │   ├── user.model.js
│       │   ├── post.model.js
│       │   ├── Like.model.js
│       │   └── follow.model.js
│       └── routes/
│           ├── auth.routes.js
│           ├── post.routes.js
│           └── user.routes.js
│
└── Frontend/
    └── src/
        ├── App.jsx
        ├── app.routes.jsx          # Route definitions with ProtectedRoute / PublicRoute
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   └── PublicRoute.jsx
        └── features/
            ├── Auth/               # Login, Register, auth context, useAuth hook
            ├── Post/               # Feed, CreatePost, Post card, Sidebar, usePost hook
            └── Profile/            # Profile edit, Followers, Following, Follow Requests
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ✗ | Create a new account |
| POST | `/login` | ✗ | Login and receive session cookie |
| GET | `/get-me` | ✓ | Get the currently logged-in user |
| POST | `/logout` | ✓ | Clear session cookie |

### Posts — `/api/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✓ | Create a new post (multipart/form-data) |
| GET | `/` | ✓ | Get all posts by the current user |
| GET | `/feed` | ✓ | Get feed (posts from followed users) |
| GET | `/details/:postId` | ✓ | Get a single post detail |
| POST | `/like/:postId` | ✓ | Toggle like on a post |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/profile` | ✓ | Update profile (multipart/form-data) |
| POST | `/follow/:username` | ✓ | Send a follow request |
| POST | `/unfollow/:username` | ✓ | Unfollow a user |
| GET | `/followers` | ✓ | Get list of followers |
| GET | `/following` | ✓ | Get list of users you follow |
| GET | `/follow-requests` | ✓ | Get pending incoming follow requests |
| POST | `/follow-requests/:id/accept` | ✓ | Accept a follow request |
| POST | `/follow-requests/:id/reject` | ✓ | Reject a follow request |

---

## Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB)
- An [ImageKit](https://imagekit.io) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/socialsync.git
cd socialsync
```

### 2. Set up environment variables

Create a `.env` file inside the `Backend/` folder:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/socialsync
JWT_SECRET=your_super_secret_key_here
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
PORT=3000
```

### 3. Install and run the backend

```bash
cd Backend
npm install
npm run dev
```

The API server starts at `http://localhost:3000`.

### 4. Install and run the frontend

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The React dev server starts at `http://localhost:5173` and proxies API calls to the backend.

---

## Deployment (Render)

SocialSync uses a **single-service deployment** — the React app is built and served as static files directly from the Express server. No separate frontend hosting needed.

### Step 1 — Build the frontend

Run this from the repo root:

```bash
cd Frontend && npm run build
cd ..
rm -rf Backend/public
cp -r Frontend/dist/. Backend/public/
```

### Step 2 — Push to GitHub

```bash
git add -A
git commit -m "chore: production build"
git push
```

### Step 3 — Create a Web Service on Render

| Setting | Value |
|---|---|
| **Root Directory** | `Backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Environment** | Add the 3 env vars from Step 2 above |

Render will detect pushes to your main branch and auto-deploy.

---

## Data Models

### User
```
username     String (unique, required)
email        String (unique, required)
password     String (hashed, select: false)
bio          String
ProfileImage String (default: CDN placeholder)
```

### Post
```
caption   String
imgUrl    String (required)
user      ObjectId → users (required)
```

### Like
```
post   ObjectId → posts (required)
user   ObjectId → users (required)
// compound unique index: { post, user }
```

### Follow
```
follower  String (username)
followee  String (username)
status    Enum: pending | accepted | rejected
// compound unique index: { follower, followee }
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✓ | MongoDB connection string |
| `JWT_SECRET` | ✓ | Secret used to sign JWT tokens |
| `IMAGEKIT_PRIVATE_KEY` | ✓ | ImageKit private API key for uploads |
| `PORT` | ✗ | Server port (defaults to 3000) |

---

## Screenshots

> The app features a dark-mode UI with an orange accent palette throughout.

- **Feed** — Scrollable post cards with like/follow actions inline
- **Create Post** — Drag-and-drop image upload with caption
- **Profile** — Edit name, bio, email, password, and avatar
- **Follow Requests** — Accept or reject incoming requests
- **Followers / Following** — Browse your social graph

---

## Learnings

- Implementing JWT authentication via HTTP-only cookies for secure, credential-based sessions
- Using Multer memory storage to stream file uploads directly to ImageKit without writing to disk
- Designing a follow system with pending/accepted/rejected states
- Structuring a React app with feature-based folders, Context API for global state, and custom hooks
- Building a single-origin deployment where Express serves both the API and the built React SPA

---

## License

MIT — feel free to fork and build on top of this project.