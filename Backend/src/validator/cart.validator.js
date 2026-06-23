import { body, param, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateAddToCart = [
  param("productId").isMongoId().withMessage("Invalid product Id!"),
  param("variantId").optional().isMongoId().withMessage("Invalid variantId"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  validateRequest,
];

export const validateIncrementCartItemQuantity = [
  param("productId").isMongoId().withMessage("Invalid product Id!"),
  param("variantId").optional().isMongoId().withMessage("Invalid variantId"),
  validateRequest,
];

export const validateRemoveCartItem = [
  param("productId").isMongoId().withMessage("Invalid product Id!"),
  param("variantId").optional().isMongoId().withMessage("Invalid variantId"),
  validateRequest,
];
