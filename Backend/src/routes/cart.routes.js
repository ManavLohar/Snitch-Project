import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter
  .post(
    "/add/:productId/:variantId",
    authenticateUser,
    validateAddToCart,
    addToCart,
  )
  .get("/", authenticateUser, getCart);

export { cartRouter };
