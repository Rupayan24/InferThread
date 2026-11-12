import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Store incoming audio in memory --> 10MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});


// Speech-to-Text

router.post("/transcribe", authMiddleware, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is missing on server." });
    }


    const formData = new FormData();
    const audioBlob = new Blob([req.file.buffer], {
      type: req.file.mimetype || "audio/webm",
    });


    formData.append("file", audioBlob, req.file.originalname || "recording.webm");

    formData.append("model", "whisper-large-v3-turbo");
    formData.append("response_format", "json");



    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: formData,
      }
    );


    const data = await groqResponse.json();


    if (!groqResponse.ok) {
      console.error("Groq Whisper error:", data);
      return res.status(groqResponse.status).json({
        error: data?.error?.message || "GROQ transcription failed.",
      });
    }


    return res.json({ text: data.text || "" });
  } catch (err) {
    console.error("STT error:", err);
    return res.status(500).json({ error: "Failed to transcribe audio." });
  }
});


// Text-to-Speech

router.post("/speak", authMiddleware, async (req, res) => {
  try {
    const { text, voice = "daniel" } = req.body;


    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required for speech." });
    }


    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is missing on server" });
    }


    const cleanText = text
      .replace(/```[\s\S]*?```/g, "Code block omitted.")
      .replace(/[#*_`~>-]/g, "")
      .trim()
      .slice(0, 4000);

    if (!cleanText) {
      return res.status(400).json({ error: "No speakable text found." });
    }


    const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "canopylabs/orpheus-v1-english",
          input: cleanText, voice,
          response_format: "wav",
        }),
      }
    );

    if (!groqResponse.ok) {
      const errData = await groqResponse.json().catch(() => ({}));
      console.error("Groq TTS error:", errData);
      return res.status(groqResponse.status).json({
        error: errData?.error?.message || "Groq TTS failed.",
      });
    }


    const audioBuffer = Buffer.from(await groqResponse.arrayBuffer());

    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": audioBuffer.length,
    });


    return res.send(audioBuffer);
  } catch (err) {
    console.log("TTS error:", err);
    return res.status(500).json({ error: "Failed to generate speech." });
  }
});


export default router;