# Inkwell — Blog Platform
> Full-stack blog website built with React, Node.js, Express, and MongoDB..

---

## Features

**For Readers**
- Browse, search, and filter posts by category and tag
- Like and save posts
- Comment and reply on posts
- View author profiles

**For Authors**
- Write rich-text posts with a custom editor
- Manage drafts and published stories
- Edit or delete posts
- Dashboard with views/likes analytics

**For Admins**
- All author permissions
- Delete any post or comment
- Manage user roles

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Zustand, React Router v6 |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB, Mongoose                   |
| Auth      | JWT + bcryptjs                      |
| Styling   | Custom CSS (Playfair Display + DM Sans) |

---

## Project Structure

```
blog-platform/
├── server/                    # Node.js + Express backend
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js            # Auto-slug, read-time, text index
│   │   └── Comment.js         # Nested replies
│   ├── controllers/           # Business logic
│   │   ├── auth.controller.js
│   │   ├── post.controller.js
│   │   ├── comment.controller.js
│   │   └── user.controller.js
│   ├── routes/                # Express routers
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   ├── user.routes.js
│   │   └── tag.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js # protect, optionalAuth, authorize
│   ├── seed.js                # Demo data seeder
│   ├── .env.example
│   └── server.js
│
└── client/                    # React + Vite frontend
    ├── src/
    │   ├── api/axios.js        # Axios with auth interceptor
    │   ├── store/authStore.js  # Zustand global auth state
    │   ├── styles/global.css   # Editorial design system
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── PostCard.jsx    # Default + featured variants
    │   ├── pages/
    │   │   ├── Home.jsx        # Hero + featured + recent posts
    │   │   ├── PostList.jsx    # Search, filter, paginate
    │   │   ├── PostDetail.jsx  # Full post + comments + related
    │   │   ├── WritePost.jsx   # Rich text editor + metadata
    │   │   ├── EditPost.jsx
    │   │   ├── Dashboard.jsx   # Stats + post manager + profile
    │   │   ├── AuthorProfile.jsx
    │   │   ├── SavedPosts.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   └── App.jsx             # Routes + private route guard
    ├── index.html
    └── vite.config.js
```

---

## Setup & Run

### Prerequisites
- Node.js v18 or higher
- MongoDB running locally OR a MongoDB Atlas URI

---

### Step 1 — Clone or unzip the project

```bash
cd blog-platform
```

---

### Step 2 — Configure the server

```bash
cd server
cp .env.example .env
```

Open `.env` and set:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=pick_any_long_random_string_here
CLIENT_URL=http://localhost:5173
```

> For MongoDB Atlas: replace `MONGO_URI` with your Atlas connection string.

---

### Step 3 — Install server dependencies

```bash
npm install
```

---

### Step 4 — Seed demo data (recommended)

```bash
node seed.js
```

This creates:
| Role    | Email                    | Password  |
|---------|--------------------------|-----------|
| Admin   | admin@inkwell.com        | admin123  |
| Author  | author@inkwell.com       | demo123   |
| Reader  | reader@inkwell.com       | demo123   |

And 6 sample blog posts across different categories.

---

### Step 5 — Start the server

```bash
npm run dev       # Development (auto-restart with nodemon)
# or
npm start         # Production
```

Server runs on **http://localhost:5000**

---

### Step 6 — Setup the client (new terminal)

```bash
cd ../client
npm install
npm run dev
```

Client runs on **http://localhost:5173**

---

## API Reference

### Auth
| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|--------------------|
| POST   | /api/auth/register  | Public  | Register user      |
| POST   | /api/auth/login     | Public  | Login              |
| GET    | /api/auth/me        | Private | Get current user   |
| PUT    | /api/auth/profile   | Private | Update profile     |

### Posts
| Method | Endpoint               | Access           | Description          |
|--------|------------------------|------------------|----------------------|
| GET    | /api/posts             | Public           | List all posts       |
| GET    | /api/posts/:slug       | Public           | Get post by slug     |
| GET    | /api/posts/author/my   | Author/Admin     | My posts             |
| GET    | /api/posts/related/:slug | Public         | Related posts        |
| POST   | /api/posts             | Author/Admin     | Create post          |
| PUT    | /api/posts/:id         | Owner/Admin      | Update post          |
| DELETE | /api/posts/:id         | Owner/Admin      | Delete post          |
| POST   | /api/posts/:id/like    | Logged in        | Toggle like          |

### Comments
| Method | Endpoint                | Access    | Description         |
|--------|-------------------------|-----------|---------------------|
| GET    | /api/comments/:postId   | Public    | Get comments        |
| POST   | /api/comments/:postId   | Logged in | Add comment/reply   |
| DELETE | /api/comments/:id       | Owner/Admin | Delete comment    |
| POST   | /api/comments/:id/like  | Logged in | Like comment        |

### Users
| Method | Endpoint              | Access    | Description       |
|--------|-----------------------|-----------|-------------------|
| GET    | /api/users/:id        | Public    | Author profile    |
| POST   | /api/users/save/:postId | Logged in | Toggle save post |
| GET    | /api/users/saved      | Logged in | Get saved posts   |

### Tags
| Method | Endpoint   | Access | Description           |
|--------|------------|--------|-----------------------|
| GET    | /api/tags  | Public | All tags with counts  |

---

## Query Parameters (GET /api/posts)

| Param    | Example              | Description             |
|----------|----------------------|-------------------------|
| page     | ?page=2              | Pagination (default: 1) |
| limit    | ?limit=6             | Per page (default: 9)   |
| category | ?category=Technology | Filter by category      |
| tag      | ?tag=javascript      | Filter by tag           |
| search   | ?search=mongodb      | Full-text search        |
| author   | ?author=<userId>     | Posts by author         |
| featured | ?featured=true       | Featured posts only     |

---

## Case Study Notes

### AIP (Advanced Internet Programming)
- RESTful API design with Express router separation
- JWT authentication with role-based middleware
- MongoDB text indexing for full-text search
- Mongoose virtual fields, hooks (`pre save`), and aggregation pipelines
- Nested data relations (posts → comments → replies)
- Slug auto-generation with `slugify`

### Frontend Development
- React 18 with functional components and hooks
- Zustand for lightweight global state management
- Protected routes with role-based access control
- Custom `contentEditable` rich text editor (no library dependency)
- Responsive CSS-only design system using CSS variables
- Axios interceptors for automatic auth header injection
- Optimistic UI updates for likes, comments, and saves

---

## Customisation Ideas

- Add image upload via Cloudinary (replace URL input)
- Add email notifications on new comments (Nodemailer)
- Add markdown support instead of HTML editor
- Add an admin panel to manage all users and posts
- Add reading history tracking per user
- Add newsletter subscription with MailChimp API
