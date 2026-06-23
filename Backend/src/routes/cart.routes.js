import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  validateAddToCart,
  validateIncrementCartItemQuantity,
  validateRemoveCartItem,
} from "../validator/cart.validator.js";
import {
  addToCart,
  decreaseCartItemQuantity,
  getCart,
  incrementCartItemQuantity,
  removeCartItem,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter
  .post(
    "/add/:productId/:variantId",
    authenticateUser,
    validateAddToCart,
    addToCart,
  )
  .get("/", authenticateUser, getCart)
  .patch(
    "/quantity/increment/:productId/:variantId",
    authenticateUser,
    validateIncrementCartItemQuantity,
    incrementCartItemQuantity,
  )
  .patch(
    "/quantity/decrement/:productId/:variantId",
    authenticateUser,
    validateIncrementCartItemQuantity,
    decreaseCartItemQuantity,
  )
  .patch(
    "/remove/:productId/:variantId",
    authenticateUser,
    validateRemoveCartItem,
    removeCartItem,
  );

export { cartRouter };
