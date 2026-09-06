# E-Commerce Platform — MERN Stack

A full-stack e-commerce application with role-based access control, JWT authentication with refresh token rotation, and a complete product/order management system. Built to go beyond basic CRUD by implementing production-style security patterns: token rotation, bcrypt-hashed credentials, rate limiting, and layered authorization across both the API and UI.

## Live Demo

- **Frontend:** [add Vercel URL after deployment]
- **Backend API:** [add Railway URL after deployment]

## Features

**Authentication & Security**
- JWT access tokens (15 min) paired with rotating refresh tokens (7 days, stored server-side)
- Refresh token rotation — each use invalidates the old token and issues a new one, limiting the damage window of a stolen token
- httpOnly, sameSite cookies for refresh tokens (inaccessible to client-side JavaScript, mitigating XSS token theft)
- Passwords hashed with bcrypt (salted, cost factor 10) — never stored or returned in plain text
- Rate limiting on signup and login endpoints to slow brute-force and mass-account-creation attempts
- Silent session restoration on page load using the refresh token, without exposing the access token to persistent browser storage

**Authorization**
- Role-based access control (customer / admin) enforced via Express middleware chains
- Public product browsing, with admin-only product creation, editing, and deletion
- Customers can only view their own orders; only admins can view and manage all orders
- Frontend route guards mirror backend rules for UX, while all real enforcement lives server-side

**Core Functionality**
- Full product catalog CRUD with image previews and graceful fallback for missing/broken images
- Order creation with server-side stock validation and atomic price snapshotting (an order always reflects the price paid at purchase time, independent of later price changes)
- Automatic stock decrement on order placement
- Order status workflow (pending → shipped → delivered / cancelled) manageable from an admin dashboard
- Personal order history for every user

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, express-rate-limit
**Frontend:** React (Vite), React Router, Axios, Tailwind CSS
**Tooling:** Postman (API testing with environment-scoped token chaining), Git/GitHub, MongoDB Atlas, Railway (backend hosting), Vercel (frontend hosting)

## Architecture Highlights

A few implementation details worth calling out, since they're the parts that separate this from a basic tutorial CRUD app:

- **Two-token auth model.** Access tokens are short-lived and stateless (verified via signature only, no DB lookup). Refresh tokens are long-lived but stored in MongoDB, making them individually revocable — logging out or rotating a token actually deletes the database record, not just the client-side cookie.
- **Axios interceptor pattern.** A request interceptor attaches the current access token to every outgoing call. A response interceptor catches `401`s, silently calls `/auth/refresh`, and retries the original failed request — so an expired token never surfaces as a visible error to the user. The refresh endpoint itself is explicitly excluded from this retry logic to prevent infinite loops on a genuinely expired session.
- **Price snapshotting.** Order line items store the product's price *at the time of purchase*, separate from the live `Product` document. This means a later price change never retroactively alters a customer's historical order — a small detail that matters for real financial accuracy.
- **Layered validation.** HTML5 constraints catch obvious bad input client-side; Mongoose schema validation (`min`, `enum`, `required`) enforces data integrity server-side — including on partial updates via `findByIdAndUpdate`, which requires explicitly opting in to validation (`runValidators: true`), a common gap in a lot of Mongoose code.
- **Middleware composition.** Authorization is built from two independent, stackable pieces — `auth` (is this a valid, logged-in request?) and `requireRole` (does this user have the right role?) — composed per-route rather than duplicated inline in every controller.

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=a_long_random_string
PORT=5000
```

Run the server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend to be running at `http://localhost:5000`.

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/signup` | Public (rate-limited) | Register a new user, returns access token + sets refresh cookie |
| POST | `/login` | Public (rate-limited) | Authenticate, returns access token + sets refresh cookie |
| POST | `/refresh` | Requires valid refresh cookie | Rotates refresh token, issues new access token |
| POST | `/logout` | Requires valid refresh cookie | Invalidates the current session |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all products |
| POST | `/` | Admin only | Create a product |
| PUT | `/:id` | Admin only | Update a product |
| DELETE | `/:id` | Admin only | Delete a product |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Authenticated | Place an order (validates stock, snapshots price) |
| GET | `/my` | Authenticated | View the logged-in user's own orders |
| GET | `/all` | Admin only | View every order in the system |
| PUT | `/:id/status` | Admin only | Update an order's status |

## Project Structure

```
backend/
  config/       # DB connection
  controllers/  # Route logic (auth, products, orders)
  middleware/   # auth, role-based access, rate limiting
  models/       # Mongoose schemas (User, Product, Order, RefreshToken)
  routes/       # Express route definitions

frontend/
  src/
    api/         # Axios instance + interceptors
    context/     # AuthContext (in-memory token + user state)
    components/  # Navbar, ProtectedRoute
    pages/       # Login, Signup, Products, MyOrders, AllOrders, CreateProduct
```

## What I'd Improve Next

- Move the in-memory access token and Context state into a single source of truth (currently synced manually in two places)
- Add pagination and search/filtering to the product catalog
- Build a proper multi-item shopping cart instead of one-product-at-a-time ordering
- Add automated tests (currently verified through manual Postman testing with environment-scoped scripts)
- Add product image uploads instead of relying on external URLs