import express from 'express';
import cors from 'cors';

// ── Route imports ─────────────────────────────────────────────────
import toursRouter from './routes/tours';
import blogsRouter from './routes/blogs';
import authRouter from './routes/auth';
import enquiriesRouter from './routes/enquiries';
import userRouter from './routes/user';
import contactRouter from './routes/contact';
import customizeRouter from './routes/customize';
import destinationsRouter from './routes/destinations';
import activitiesRouter from './routes/activities';
import eatRouter from './routes/eat';
import policiesRouter from './routes/policies';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ── Health check ──────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── v1 Routes (spec-aligned paths) ───────────────────────────────
app.use('/v1/auth', authRouter);
app.use('/v1/account', userRouter);
app.use('/v1/contact', contactRouter);
app.use('/v1/enquiries', enquiriesRouter);
app.use('/v1/customize', customizeRouter);
app.use('/v1/tours', toursRouter);
app.use('/v1/destinations', destinationsRouter);
app.use('/v1/activities', activitiesRouter);
app.use('/v1/eat', eatRouter);
app.use('/v1/blogs', blogsRouter);
app.use('/v1/policies', policiesRouter);

// ── Legacy /api routes (backward compat) ─────────────────────────
app.use('/api/tours', toursRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/auth', authRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/user', userRouter);
app.use('/api/contact', contactRouter);
app.use('/api/customize', customizeRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/eat', eatRouter);
app.use('/api/policies', policiesRouter);

// ── 404 handler ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
