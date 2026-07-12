import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/public folder
const publicPath = path.resolve(__dirname, "../public");

const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

/* -------------------- Middlewares -------------------- */

app.use(
  cors({
    origin: isProduction
      ? "https://pehrawa.onrender.com"
      : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

/* -------------------- Passport -------------------- */

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://pehrawa.onrender.com/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

/* -------------------- Health Check -------------------- */

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

/* -------------------- API Routes -------------------- */

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

/* -------------------- Invalid API Route -------------------- */

app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* -------------------- React Frontend -------------------- */

app.use(express.static(publicPath));

app.use((req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  return res.sendFile(path.join(publicPath, "index.html"));
});

/* -------------------- Error Handler -------------------- */

app.use((error, req, res, next) => {
  console.error("Global error:", error);

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;