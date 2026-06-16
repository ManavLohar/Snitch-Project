import { Router } from "express";
import {
  authenticateSeller,
  authenticateUser,
} from "../middlewares/auth.middleware.js";
import {
  addProductVariant,
  createProduct,
  getAllProducts,
  getProduct,
  getSellerProducts,
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const productRouter = Router();

productRouter
  .post(
    "/",
    authenticateSeller,
    upload.array("images", 7),
    createProductValidator,
    createProduct,
  )
  .get("/seller", authenticateSeller, getSellerProducts)
  .get("/", getAllProducts)
  .post(
    "/:productId/variants",
    authenticateSeller,
    upload.array("images", 7),
    addProductVariant,
  );

export { productRouter };
