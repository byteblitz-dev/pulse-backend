import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "@repo/auth/passport";
import athleteRoutes from "./routes/athlete";
import officialRoutes from "./routes/official";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use("/athlete", athleteRoutes);
app.use("/official", officialRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});