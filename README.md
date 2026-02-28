# My Blog App

Full-stack blog platform with:
- Public article browsing
- JWT + refresh-token authentication
- Profile pages
- Likes and moderated comments
- Role-based admin dashboard for post and user management
- App-wide `light` / `dark` / `system` theme support

## Stack

### Frontend
- React 19 + Vite
- React Router
- TanStack Query
- Tailwind CSS 4
- Axios

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT auth (`access` + rotating `refresh` token)
- Joi validation
- Multer + Cloudinary (image uploads)

## Repository Layout

```text
my_blog/
  src/                  # Frontend app
  backend/              # Backend API server
  router.jsx            # Frontend route map
  docs/
    FULL_APP_DOCUMENTATION.md
```

## Quick Start

### 1. Install dependencies

```bash
# frontend deps
npm install

# backend deps
cd backend
npm install
cd ..
```

### 2. Configure environment

Create `backend/.env`:

```env
DATABASE_URL=mongodb://127.0.0.1:27017/my_blog
ACCESS_TOKEN_SECRET=change_me_access
REFRESH_TOKEN_SECRET=change_me_refresh

# Optional
PORT=5001
CORS_ORIGIN=http://localhost:5173
COOKIE_DOMAIN=
AUTH_RATE_LIMIT_WINDOW_MS=60000
AUTH_RATE_LIMIT_MAX=10
API_RATE_LIMIT_WINDOW_MS=60000
API_RATE_LIMIT_MAX=120
COMMENT_TTL_DAYS=30
TRUST_PROXY=false

# Optional (needed only for file uploads to Cloudinary)
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

Create frontend env file (`.env` in project root) only if backend URL differs:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### 3. Run in development

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend health: `http://localhost:5001/api/health`

## Scripts

### Frontend (root)
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview build
- `npm run lint` - ESLint

### Backend (`backend/`)
- `npm run dev` - start with nodemon
- `npm run start` - start with node
- `npm test` - Jest + Mongo memory server

## Full Documentation

For complete technical documentation (architecture, routes, API reference, auth flow, theming, testing, deployment, and troubleshooting), read:

- [docs/FULL_APP_DOCUMENTATION.md](./docs/FULL_APP_DOCUMENTATION.md)
