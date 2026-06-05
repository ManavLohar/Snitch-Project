import { Router } from "express";
import {
  googleCallback,
  login,
  register,
} from "../controllers/auth.controller.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../validator/auth.validator.js";
import passport from "passport";

const authRouter = Router();

authRouter
  .post("/register", validateRegisterUser, register)
  .post("/login", validateLoginUser, login)
  .get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  )
  .get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "http://localhost:5173/login",
    }),
    googleCallback,
  );

export { authRouter };
