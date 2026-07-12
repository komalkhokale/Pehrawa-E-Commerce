import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRouter from "./routes/auth.routes.js";
import productsRouter from "./routes/products.routes.js"
import cartRouter from "../src/routes/cart.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js";
import reviewRoutes from "./routes/review.routes.js";

import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {config} from "./config/config.js";

import cors from "cors";

import path from "path";

const app = express();

app.use(express.json());
app.use(express.static("./public"))
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },(accessToken, refreshToken, profile, done) => {
    return done(null, profile)
  }))


app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

app.use('*name',(req, res) => {
    res.sendFile(path.join(__dirname, "..", "/public/index.html"))
})


export default app;