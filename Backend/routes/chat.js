import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "test-" + Date.now(),
      title: "Testing New Thread",
    });

    const response = await thread.save();
    res.status(201).json(response);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.status(200).json(threads);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get specific thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json(thread.messages); // or res.json(thread) to return the whole object
  } catch (err) {
    console.error("Fetch Thread Error:", err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// Delete Specific thread

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;


  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// Chat Route


router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;


  // validate threadId, message
  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }


  try {
    let thread = await Thread.findOne({ threadId });


    if (!thread) {
      // we need to create a new thread
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }]
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }


    const assistantReply = await getOpenAIAPIResponse(message);


    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    res.json({ reply: assistantReply });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

export default router;
