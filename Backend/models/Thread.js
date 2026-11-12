import mongoose from "mongoose";
import { MessageSchema } from "./Message.js";

const ThreadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
