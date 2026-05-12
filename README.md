# indiaTravel.net — Backend API

REST API backend for [indiaTravel.net](https://indiatravel.net). Built with **Node.js, Express, TypeScript, MongoDB Atlas, JWT auth, Zod validation, and Nodemailer**.

---

## Quick Start

### 1. Clone and install
```bash
git clone <your-repo-url> travel-api
cd travel-api
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Then fill in `.env`:
- `MONGODB_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `GMAIL_USER` + `GMAIL_APP_PASSWORD` — see below
- `ADMIN_EMAIL` — where enquiry emails go
- `ALLOWED_ORIGINS` — your frontend URL(s)

**Getting a Gmail App Password:**
1. Go to [myaccount.google.com](https://myaccount.google.com) → Security → 2-Step Verification → App passwords
2. Create an app password for "Mail"
3. Paste the 16-character code into `GMAIL_APP_PASSWORD`

### 3. Seed the database (first time only)
```bash
npm run seed
```

### 4. Run in development
```bash
npm run dev
```
API will be live at `http://localhost:5000`

---

## API Endpoints

### Health
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/health` | None |

### Tours
| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/tours` | None | `?category=handpicked\|golden-triangle\|same-day` |
| GET | `/api/tours/:id` | None | Full detail with itinerary |
| POST | `/api/tours/:id/reviews` | Required | Submit a review |

### Blogs
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/api/blogs` | None | `?category=Wildlife\|Travel Tips` |
| GET | `/api/blogs/:slug` | None |

### Auth
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/signup` | None |
| POST | `/api/auth/login` | None |
| GET | `/api/auth/me` | Required |
| POST | `/api/auth/forgot-password` | None |
| POST | `/api/auth/verify-otp` | None |
| POST | `/api/auth/reset-password` | None |

> Send auth token as `Authorization: Bearer <token>` header.

### Enquiries
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/enquiries` | Optional | Itinerary enquiry |
| POST | `/api/enquiries/custom` | Optional | Custom tour planner |
| POST | `/api/enquiries/cart` | Optional | Trip cart enquiry |

### User (all require auth)
| Method | Endpoint |
|---|---|
| GET/PUT | `/api/user/profile` |
| PUT | `/api/user/change-password` |
| DELETE | `/api/user/account` |
| GET/POST | `/api/user/cart` |
| DELETE | `/api/user/cart/:id` |
| GET/POST | `/api/user/favourites` |
| DELETE | `/api/user/favourites/:category/:id` |
| GET | `/api/user/enquiries` |

---

## Production Deployment (DigitalOcean Droplet)

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
sudo certbot --nginx -d api.indiatravel.net
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript → dist/ |
| `npm start` | Run compiled JS (production) |
| `npm run seed` | Seed MongoDB with tour/blog data |
