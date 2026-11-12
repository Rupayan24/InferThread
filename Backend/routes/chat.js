import express from "express";
import authMiddleware from "../middleware/auth.js";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// 1. Get all threads belonging exclusively to the authenticated user
router.get("/thread", authMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user.id })
      .select("threadId title updatedAt createdAt")
      .sort({ updatedAt: -1 });

    res.status(200).json(threads);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// 2. Get specific thread (isolated to the owner)
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId,
      userId: req.user.id,
    });

    if (!thread) {
      return res
        .status(404)
        .json({ error: "Thread not found or unauthorized access" });
    }

    res.status(200).json(thread.messages);
  } catch (err) {
    console.error("Fetch Thread Error:", err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// 3. Delete specific thread (isolated to the owner)
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.user.id,
    });

    if (!deletedThread) {
      return res
        .status(404)
        .json({ error: "Thread not found or unauthorized access" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error("Delete Thread Error:", err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// 4. Chat Route: create/append to thread with owner ID
router.post("/chat", authMiddleware, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message?.trim()) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      userId: req.user.id,
    });

    if (!thread) {
      // Create new thread bound to the logged-in user
      const initialTitle =
        message.trim().slice(0, 30) + (message.length > 30 ? "..." : "");

      thread = new Thread({
        userId: req.user.id, // Satisfies Mongoose required validation
        threadId,
        title: initialTitle,
        messages: [{ role: "user", content: message.trim() }],
      });
    } else {
      thread.messages.push({ role: "user", content: message.trim() });
    }

    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.status(200).json({ reply: assistantReply });
  } catch (err) {
    console.error("Chat Route Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
