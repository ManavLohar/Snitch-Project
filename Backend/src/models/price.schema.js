import { Schema } from "mongoose";

export const priceSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "INR"],
      default: "INR",
    },
  },
  {
    _id: false,
    _v: false,
  },
);
