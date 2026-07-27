# indiaTravel.net — Backend API

> REST API backend for [indiaTravel.net](https://indiatravel.net)

Built with **Node.js · Express · TypeScript · MongoDB Atlas · JWT (access + refresh tokens) · Zod · Nodemailer**

---

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
  - [Base URLs](#base-urls)
  - [Authentication](#authentication)
  - [Auth Endpoints](#auth-endpoints)
  - [Account Endpoints](#account-endpoints)
  - [Contact & Support](#contact--support)
  - [Enquiries](#enquiries)
  - [Customize Tours](#customize-tours)
  - [Tours](#tours)
  - [Destinations](#destinations)
  - [Activities](#activities)
  - [Eat](#eat)
  - [Blogs](#blogs)
  - [Policies](#policies)
- [Scripts](#scripts)
- [Production Deployment](#production-deployment)

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/Monkova-Technologies/IndiaTravels---Backend.git
cd IndiaTravels---Backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in all values — see [Environment Variables](#environment-variables).

### 3. Seed the database *(first time only)*

```bash
npm run seed
```

### 4. Run in development

```bash
npm run dev
```

API is live at `http://localhost:5000`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret for signing access tokens |
| `JWT_EXPIRES_IN` | No | Access token lifetime (default: `15m`) |
| `JWT_REFRESH_SECRET` | No | Secret for refresh tokens (falls back to `JWT_SECRET`) |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh token lifetime (default: `30d`) |
| `GMAIL_USER` | ✅ | Gmail address for sending emails |
| `GMAIL_APP_PASSWORD` | ✅ | Gmail App Password (16-char code) |
| `ADMIN_EMAIL` | ✅ | Where enquiry notifications are sent |
| `ALLOWED_ORIGINS` | ✅ | Comma-separated list of allowed CORS origins |
| `OTP_EXPIRY_MINUTES` | No | OTP validity window (default: `10`) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID for `/auth/google` |

**Getting a Gmail App Password:**
1. [myaccount.google.com](https://myaccount.google.com) → Security → 2-Step Verification → App passwords
2. Generate a password for "Mail"
3. Paste the 16-character code into `GMAIL_APP_PASSWORD`

---

## Project Structure

```
src/
├── app.ts                    # Express app, middleware, route mounting
├── index.ts                  # Server entry point
├── config/
│   └── db.ts                 # MongoDB connection
├── controllers/              # Request handlers
│   ├── authController.ts
│   ├── userController.ts
│   ├── contactController.ts
│   ├── enquiryController.ts
│   ├── customizeController.ts
│   ├── tourController.ts
│   ├── destinationController.ts
│   ├── activityController.ts
│   ├── eatController.ts
│   ├── blogController.ts
│   └── policyController.ts
├── routes/                   # Express routers
│   ├── auth.ts
│   ├── user.ts
│   ├── contact.ts
│   ├── enquiries.ts
│   ├── customize.ts
│   ├── tours.ts
│   ├── destinations.ts
│   ├── activities.ts
│   ├── eat.ts
│   ├── blogs.ts
│   └── policies.ts
├── models/                   # Mongoose schemas
│   ├── User.ts
│   ├── Enquiry.ts
│   ├── Tour.ts
│   ├── Destination.ts
│   ├── Activity.ts
│   ├── Eat.ts
│   ├── Blog.ts
│   └── Policy.ts
├── schemas/                  # Zod validation schemas
│   ├── authSchema.ts
│   ├── enquirySchema.ts
│   ├── contactSchema.ts
│   └── tourSchema.ts
├── middleware/
│   ├── auth.ts               # JWT protect middleware
│   └── validate.ts           # Zod request validation
└── utils/
    └── mailer.ts             # Nodemailer helpers
```

---

## API Reference

### Base URLs

| Version | Base URL | Purpose |
|---|---|---|
| **v1** (current spec) | `https://api.indiatravels.net/v1` | Use for all new integrations |
| Legacy | `https://api.indiatravels.net/api` | Backward compat — do not use for new work |

> All endpoints below use the `/v1` prefix.

### Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are issued as a pair on login/register:
- **`accessToken`** — short-lived (15 min), use for API requests
- **`refreshToken`** — long-lived (30 days), use only to obtain a new access token via `POST /auth/refresh`

---

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Create account |
| POST | `/auth/login` | None | Email/password login |
| POST | `/auth/logout` | ✅ Required | Revoke refresh token |
| POST | `/auth/refresh` | None | Get new token pair |
| POST | `/auth/google` | None | Google OAuth login |
| GET | `/auth/me` | ✅ Required | Current user info |
| POST | `/auth/password/forgot` | None | Send OTP to email |
| POST | `/auth/password/reset` | None | Reset password via OTP |

**Register / Login response:**
```json
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "...", "name": "...", "email": "...", "avatar": null }
}
```

**Refresh body:**
```json
{ "refreshToken": "<refresh_token>" }
```

**Forgot password body:**
```json
{ "email": "user@example.com" }
```

**Reset password body:**
```json
{ "email": "user@example.com", "otp": "123456", "newPassword": "newpass123" }
```

---

### Account Endpoints

> All `/account/*` endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/account/profile` | Fetch user profile |
| PATCH | `/account/profile` | Update name, phone, avatar |
| GET | `/account/enquiries` | List user's enquiry history |
| GET | `/account/cart` | Fetch server-side cart |
| POST | `/account/cart` | Add item to cart |
| PUT | `/account/cart` | Replace entire cart (body: `{ items: [] }`) |
| DELETE | `/account/cart/:tourId` | Remove item from cart |
| POST | `/account/cart/checkout` | Convert cart → enquiry, clears cart |
| GET | `/account/favourites` | List favourites |
| POST | `/account/favourites` | Add to favourites |
| DELETE | `/account/favourites/:category/:id` | Remove from favourites |
| PUT | `/account/change-password` | Change password |
| DELETE | `/account/account` | Delete account |

---

### Contact & Support

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/contact/enquiries` | None | Submit contact form |

**Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "countryCode": "+91",
  "phone": "9876543210",
  "country": "India",
  "subject": "Tour Enquiry",
  "message": "I'd like to know more about..."
}
```

---

### Enquiries

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/enquiries/trip/options` | None | Add-ons, categories, meeting points metadata |
| POST | `/enquiries/trip` | None | Submit trip-cart enquiry |
| POST | `/enquiries` | None | Submit itinerary enquiry (legacy) |
| POST | `/enquiries/custom` | None | Submit custom tour enquiry (legacy) |
| GET | `/enquiries` | ✅ Required | List enquiries (filtered, paginated) |
| GET | `/enquiries/:id` | ✅ Required | Enquiry detail |

**POST `/enquiries/trip` body:**
```json
{
  "mainTour": "<tour-id>",
  "addOns": ["photography", "cooking"],
  "traveller": {
    "firstName": "John", "lastName": "Doe",
    "email": "john@example.com", "phone": "9876543210",
    "startDate": "2025-04-10", "personCount": 2,
    "meetingPoint": "Hotel Lobby", "message": "..."
  }
}
```

**GET `/enquiries` query params:**

| Param | Example | Description |
|---|---|---|
| `page` | `1` | Page number |
| `pageSize` | `20` | Results per page (max 100) |
| `status` | `pending` | Filter by status (`pending`, `contacted`, `resolved`) |
| `type` | `trip` | Filter by type (`trip`, `contact`, `custom`, `cart`, `itinerary`) |
| `email` | `john@example.com` | Filter by traveller email |
| `dateFrom` | `2025-01-01` | Filter from date |
| `dateTo` | `2025-12-31` | Filter to date |
| `all` | `true` | Return all users' enquiries (admin) |

---

### Customize Tours

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/customize/meta` | None | Regions, styles, budgets, transport options |
| POST | `/customize/enquiries` | None | Submit custom trip enquiry |

**POST `/customize/enquiries` body:**
```json
{
  "region": "Rajasthan",
  "travelStyle": "Luxury",
  "cities": ["Jaipur", "Udaipur"],
  "travelPurpose": "Honeymoon",
  "budget": "₹1,00,000 – ₹2,00,000",
  "transport": "Private Car",
  "travellerDetails": {
    "firstName": "Jane", "lastName": "Doe",
    "email": "jane@example.com", "phone": "9876543210",
    "startDate": "2025-02-14"
  }
}
```

---

### Tours

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/tours` | None | List tours (filtered, paginated) |
| GET | `/tours/:id` | None | Full tour detail with itinerary |
| POST | `/tours/:id/reviews` | ✅ Required | Submit a review |

**GET `/tours` query params:**

| Param | Example | Description |
|---|---|---|
| `q` | `taj mahal` | Full-text search |
| `region` | `Rajasthan` | Filter by region |
| `category` | `handpicked` | `handpicked`, `golden-triangle`, `same-day` |
| `ratingMin` | `4` | Minimum rating |
| `page` | `1` | Page number |
| `pageSize` | `20` | Results per page (max 100) |

---

### Destinations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/destinations` | None | List destinations (`?q=`, `?region=`) |
| GET | `/destinations/:slug` | None | Destination detail with featured tours |

---

### Activities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/activities` | None | List activities (`?tag=Safari`, `?destination=Ranthambore`) |

---

### Eat

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/eat` | None | List places to eat (`?city=Jaipur`, `?cuisine=Rajasthani`) |

---

### Blogs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/blogs` | None | List blogs (filtered, paginated) |
| GET | `/blogs/:slug` | None | Full blog detail |

**GET `/blogs` query params:** `q`, `tag`, `page`, `pageSize`

---

### Policies

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/policies` | None | Index of all policies (key + title) |
| GET | `/policies/privacy` | None | Privacy policy |
| GET | `/policies/refund` | None | Refund policy |
| GET | `/policies/cancellation` | None | Cancellation policy |
| GET | `/policies/payment` | None | Payment policy |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled JS (production) |
| `npm run seed` | Seed MongoDB with tour/blog data |

---

## Production Deployment

### 1. Build

```bash
npm run build
```

### 2. Start with PM2

```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 3. Nginx reverse proxy

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/travel-api
# Edit server_name to your domain
sudo ln -s /etc/nginx/sites-available/travel-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.indiatravels.net
```

---

## Postman Collection

A full Postman collection covering all endpoints is included at the root:

```
indiaTravel_API.postman_collection.json
```

Import it into Postman — Login or Register auto-saves the access & refresh tokens to collection variables so all protected requests work immediately.
