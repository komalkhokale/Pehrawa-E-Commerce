import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const isProduction = config.NODE_ENV === "production";

const frontendURL = isProduction
  ? "https://pehrawa.onrender.com"
  : "http://localhost:5173";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    {
      userId: user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, cookieOptions);

  return res.status(200).json({
    message,
    success: true,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export const registerUser = async (req, res) => {
  try {
    const {
      email,
      contact,
      password,
      fullname,
      isSeller,
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedContact = contact?.trim();

    const searchConditions = [{ email: normalizedEmail }];

    if (normalizedContact) {
      searchConditions.push({ contact: normalizedContact });
    }

    const existingUser = await userModel.findOne({
      $or: searchConditions,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === normalizedEmail
            ? "Email is already registered"
            : "Contact number is already registered",
      });
    }

    const user = await userModel.create({
      email: normalizedEmail,
      contact: normalizedContact,
      password,
      fullname: fullname.trim(),
      role: isSeller ? "seller" : "buyer",
    });

    return sendTokenResponse(
      user,
      res,
      "User registered successfully"
    );
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      return res.status(400).json({
        success: false,
        message: `${duplicateField || "User"} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return sendTokenResponse(
      user,
      res,
      "User logged in successfully"
    );
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const { id, displayName, emails, photos } = req.user;

    const email = emails?.[0]?.value?.trim().toLowerCase();
    const profilePicture = photos?.[0]?.value;

    if (!email) {
      return res.redirect(
        `${frontendURL}/login?error=google_email_missing`
      );
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        googleId: id,
        fullname: displayName,
        profilePicture,
        role: "buyer",
      });
    } else if (!user.googleId) {
      user.googleId = id;

      if (!user.fullname) {
        user.fullname = displayName;
      }

      if (!user.profilePicture && profilePicture) {
        user.profilePicture = profilePicture;
      }

      await user.save();
    }

    // IMPORTANT: Middleware decoded.userId read karta hai,
    // isliye yahan bhi userId hi hona chahiye.
    const token = jwt.sign(
      {
        userId: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, cookieOptions);

    return res.redirect(frontendURL);
  } catch (error) {
    console.error("Google callback error:", error);

    return res.redirect(
      `${frontendURL}/login?error=google_login_failed`
    );
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};