import { Schema, model } from "mongoose";
import { priceSchema } from "./price.schema.js";

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      variant: {
        type: Schema.Types.ObjectId,
        ref: "product.variant",
      },
      quantity: {
        type: Number,
        default: 0,
      },
      price: {
        type: priceSchema,
        required: true,
      },
    },
  ],
});

export const CartModel = model("cart", cartSchema);
