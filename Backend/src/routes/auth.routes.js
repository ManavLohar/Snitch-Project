import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { validateRegisterUser } from "../validator/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", validateRegisterUser, register);

export { authRouter };
