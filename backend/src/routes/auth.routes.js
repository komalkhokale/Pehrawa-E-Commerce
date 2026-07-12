import { Router } from "express";

import { validateRegisterUser,validateLoginUser } from "../validator/auth.validator.js";
import {
  registerUser,
  loginUser,
  googleCallback,
  getMe,
  logoutUser,
} from "../controllers/auth.controller.js";

import { config } from "../config/config.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRegisterUser, registerUser)

router.post("/login", validateLoginUser, loginUser)

router.get("/google", 
    passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
    passport.authenticate("google", {
        session : false, 
        failureRedirect: config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login"
    }),
    googleCallback
)


router.get("/me", authenticateUser , getMe)

router.post("/logout", logoutUser);


    
export default router;