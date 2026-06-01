import { connect } from "mongoose";
import { config } from "./config.js";

export async function connectDB() {
  try {
    const conn = await connect(config.MONGO_URI);
    console.log("Database connected!");
  } catch (error) {
    console.log(error.message);
  }
}
