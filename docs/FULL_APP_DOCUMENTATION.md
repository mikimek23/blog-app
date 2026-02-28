# Full App Documentation

## 1. Overview

`my_blog` is a full-stack blog platform with a React frontend and an Express/MongoDB backend.

Core capabilities:
- User registration/login/logout
- Session restoration with refresh token cookies
- Public article feed and article detail pages
- Likes and comments
- Comment moderation workflow
- Public and private user profiles
- Admin dashboard:
  - Post create/edit/delete
  - User role/status management
  - Moderation queue
- App-wide theme modes: `light`, `dark`, `system`

---

## 2. Architecture

### 2.1 High-level flow

1. Frontend calls backend API via Axios (`withCredentials: true`).
2. Backend returns `accessToken` + sets `refreshToken` cookie on login.
3. Frontend stores `accessToken` in in-memory store (`tokenStore`).
4. On `401`, Axios interceptor calls `/auth/refresh` and retries original request.
5. Session bootstrap runs on app start from `SessionLayout`.

### 2.2 Tech stack

Frontend:
- React 19
- Vite 7
- React Router
- TanStack Query
- Tailwind CSS v4
- React Toastify

Backend:
- Node.js (ESM)
- Express 5
- MongoDB + Mongoose
- Joi validation
- JWT (`15m` access token, `7d` refresh token)
- Multer memory uploads + Cloudinary

---

## 3. Project Structure

```text
my_blog/
  src/
    api/                    # frontend API clients
    components/             # reusable UI components
    components/admin/       # admin UI
    components/theme/       # theme switch UI
    hooks/                  # auth/theme hooks
    layout/                 # route layouts
    pages/                  # route pages
    theme/                  # theme provider/runtime
    index.css               # global tokens and theme styling
    main.jsx                # app bootstrap
    App.jsx                 # app shell
  backend/
    src/
      app.js                # express app wiring
      index.js              # server entrypoint
      routes/               # route definitions
      controllers/          # request handlers
      services/             # business logic
      models/               # mongoose models
      middlewares/          # auth, security, rate-limit, upload, errors
      config/               # env and cloudinary config
      tests/                # jest setup helpers
  router.jsx                # frontend route map
  docs/FULL_APP_DOCUMENTATION.md
```

---

## 4. Setup and Running

## 4.1 Prerequisites
- Node.js 20+
- npm 10+
- MongoDB (local or hosted)

## 4.2 Install dependencies

```bash
npm install
cd backend
npm install
cd ..
```

## 4.3 Environment variables

### Backend (`backend/.env`)

Required:
- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`

Optional:
- `PORT` (default `5001`)
- `CORS_ORIGIN` (default `http://localhost:5173`; comma-separated allowed)
- `COOKIE_DOMAIN`
- `AUTH_RATE_LIMIT_WINDOW_MS` (default `60000`)
- `AUTH_RATE_LIMIT_MAX` (default `10`)
- `API_RATE_LIMIT_WINDOW_MS` (default `60000`)
- `API_RATE_LIMIT_MAX` (default `120`)
- `COMMENT_TTL_DAYS` (present in config, currently not used by comment model logic)
- `TRUST_PROXY` (`true` / `false`)
- `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`

### Frontend (root `.env`, optional)
- `VITE_API_BASE_URL` (default `http://localhost:5001/api`)

## 4.4 Development run

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
npm run dev
```

URLs:
- Frontend: `http://localhost:5173`
- API health: `http://localhost:5001/api/health`

---

## 5. Frontend

## 5.1 Route map

From `router.jsx`:

Public:
- `/` -> Home
- `/posts` -> Blog list
- `/posts/:id/:slug?` -> Single post
- `/users/:username` -> Public profile
- `/login`
- `/signup`
- `/admin/login`

Protected:
- `/profile` (authenticated user)

Admin (authenticated + role `admin`):
- `/admin/dashboard`
- `/admin/posts`
- `/admin/posts/create`
- `/admin/posts/:id/edit`
- `/admin/users`
- `/admin/moderation`

## 5.2 Frontend state patterns

- Server state: TanStack Query
- Auth/session state: custom external store (`src/hooks/tokenStore.js`)
- Theme state: `ThemeProvider` context (`light` / `dark` / `system`)

## 5.3 Theme system

Files:
- `src/theme/theme.js`
- `src/theme/ThemeContext.js`
- `src/theme/ThemeProvider.jsx`
- `src/hooks/useTheme.js`
- `src/components/theme/ThemeToggle.jsx`

Behavior:
- First load defaults to `system` preference.
- Preference stored in `localStorage` key: `mblog-theme`.
- Pre-hydration script in `index.html` applies theme before React renders.
- Runtime sets:
  - `document.documentElement.dataset.theme`
  - `document.documentElement.style.colorScheme`

Theme toggle locations:
- Public navbar (desktop + mobile)
- Admin dashboard header

## 5.4 Styling system

Global semantic tokens and utilities are defined in `src/index.css`:
- Surface/background tokens for both light and dark themes
- Text, accent, border, success, danger tokens
- Utility component classes:
  - `.ui-surface`, `.ui-surface-soft`, `.ui-input`, `.ui-chip`
  - `.ui-text`, `.ui-text-muted`, `.ui-heading`
  - `.ui-alert-success`, `.ui-alert-error`
- Global focus-visible ring for accessibility
- Reduced motion support

---

## 6. Backend

## 6.1 App pipeline (`backend/src/app.js`)

Middleware order:
1. `securityHeaders`
2. `express.json`
3. `cookieParser`
4. `sanitizeInput`
5. global rate limiter
6. CORS (`credentials: true`)
7. route mounting
8. 404 fallback
9. `errorHandler`

## 6.2 Security and middleware

- `authMiddleware`: required JWT access token
- `optionalAuthMiddleware`: access token optional
- `requireRole(...roles)`: role gate (`admin`)
- `sanitizeInput`: removes script/javascript patterns in body/query
- `securityHeaders`: common hardening headers
- `createRateLimiter`: in-memory IP-based limiter

## 6.3 Data models

### `User`
- `username`, `email`, `password`, `role`, `bio`, `avatarUrl`, `isActive`
- `refreshTokenHash`, `refreshTokenExpiresAt`

### `Post`
- `title`, `content`, `author`, `tags`, `slug`, `imageUrl`, `imagePublicId`

### `Comment`
- `post`, `author`, `content`
- moderation fields: `moderationStatus`, `isFlagged`, `flaggedReason`
- TTL field: `expiresAt` (TTL index enforced)

### `Like`
- `post`, `user`
- unique index on (`post`, `user`)

---

## 7. Authentication and Session Lifecycle

1. `POST /api/auth/login` validates credentials.
2. API returns:
   - `data.accessToken`
   - `data.user`
   - sets `refreshToken` cookie (`httpOnly`)
3. Frontend sends access token in `Authorization` header.
4. On expired access token:
   - Axios interceptor calls `POST /api/auth/refresh`
   - updates token and retries original request once.
5. Logout clears both frontend session state and backend cookie/token hash.

Token details:
- Access token: `15m`
- Refresh token: `7d`, rotating on refresh

---

## 8. API Reference

Base URL: `/api`

Standard success envelope:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": {}
}
```

Standard error envelope:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "errors": []
}
```

## 8.1 Health
- `GET /health`

## 8.2 Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/refresh-token` (compat alias)
- `POST /auth/logout`
- `GET /auth/me` (auth required)
- `GET /auth/:id` (compat path, auth required)

## 8.3 Posts
- `GET /posts`
  - Query: `page`, `limit`, `sortBy`, `sortOrder`, `cursor`, `author`, `tag`, `search`
- `GET /posts/slug/:slug`
- `GET /posts/:id`

## 8.4 Admin Posts
- `POST /admin/posts` (admin)
- `PATCH /admin/posts/:id` (admin)
- `DELETE /admin/posts/:id` (admin)
- Compat alias: `/admin/post/*`

## 8.5 Comments and Moderation
- `GET /posts/:postId/comments`
- `POST /posts/:postId/comments` (auth)
- `DELETE /comments/:id` (owner/admin)
- `PATCH /comments/:id/flag` (auth)
- `GET /admin/moderation/comments` (admin)
  - Query: `status`, `flaggedOnly`, `limit`, `cursor`
- `PATCH /admin/moderation/comments/:id/status` (admin)

## 8.6 Likes
- `GET /posts/:postId/likes` (optional auth)
- `POST /posts/:postId/likes/toggle` (auth)

## 8.7 Profiles
- `GET /profiles/:username`
  - Query: `limit`, `cursor`
- `GET /profiles/me` (auth)
- `PATCH /profiles/me` (auth)

## 8.8 Admin User Management
- `GET /admin/users` (admin)
  - Query: `search`, `limit`, `cursor`
- `PATCH /admin/users/:id/role` (admin)
- `PATCH /admin/users/:id/status` (admin)

---

## 9. Admin Workflow

## 9.1 Access control
- Admin routes are guarded both frontend and backend.
- User must be authenticated and have role `admin`.

## 9.2 Post management
- Create/update supports multipart form with optional image upload.
- If uploading binary image, Cloudinary config must be valid.
- Alternatively, image URL can be sent without file upload.

## 9.3 Moderation
- User comments default to `pending`.
- Admin comments auto-approve.
- Flagging a comment sets it back to `pending`.

---

## 10. Validation Rules (Selected)

- Registration:
  - `username` min 3
  - valid `email`
  - `password` min 6
- Comment content:
  - 2 to 1200 chars
- Profile updates:
  - `bio` max 280
  - `avatarUrl` must be a URI
- ID params:
  - must be 24-char Mongo ObjectId

Source: `backend/src/utils/inputValidation.js`

---

## 11. Testing and Quality

Frontend:
- `npm run lint`
- `npm run build`

Backend:
- `cd backend && npm test`

Backend tests use:
- Jest
- mongodb-memory-server (`globalSetup` / `globalTeardown`)

---

## 12. Deployment Notes

- Use HTTPS in production so secure cookies work reliably.
- Set `NODE_ENV=production`.
- Configure `CORS_ORIGIN` to deployed frontend domain(s).
- Set `COOKIE_DOMAIN` if needed for subdomain deployments.
- Configure `TRUST_PROXY=true` behind a reverse proxy.
- Provide strong random values for JWT secrets.

---

## 13. Troubleshooting

### `401` loops on frontend
- Verify backend `ACCESS_TOKEN_SECRET`/`REFRESH_TOKEN_SECRET` are stable.
- Confirm browser accepts `refreshToken` cookie.
- Check `CORS_ORIGIN` and `withCredentials`.

### Image upload failures
- Ensure `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` are set.
- Check file type (`jpeg/png/webp/gif`) and max size (`5MB`).

### Admin access denied
- Confirm user role in DB is `admin`.
- Registration creates regular users by default.

### Comments disappearing quickly
- Current comment model default TTL is short (`COMMENT_TTL_MS` in model).
- Review `backend/src/models/comments.js` and adjust TTL behavior if needed.

---

## 14. Known Technical Notes

- Rate limiting is in-memory (not distributed); use Redis/store-backed limiter for horizontal scaling.
- There is a compatibility alias for admin post routes (`/api/admin/post`) during migration.
- `COMMENT_TTL_DAYS` exists in env config but is not currently used to compute `expiresAt` in comment creation/model defaults.

---

## 15. Maintenance Checklist

When adding new features:
1. Add backend validation schema first.
2. Add/adjust service logic.
3. Wire controller and route.
4. Add frontend API client call.
5. Add UI + query invalidation.
6. Validate:
   - lint
   - build
   - route guards
   - dark/light theme readability

