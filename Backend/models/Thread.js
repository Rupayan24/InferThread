import mongoose from "mongoose";
import { MessageSchema } from "./Message.js";

const ThreadSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true, // Automatically creates and updates createdAt & updatedAt
  },
);

export default mongoose.model("Thread", ThreadSchema);
