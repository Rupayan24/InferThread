import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY in environment variables.");
  }

  const model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      options,
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);
      throw new Error(
        data.error?.message ||
          `Groq request failed with status ${response.status}`,
      );
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI/Groq Utility Error:", err.message);
    throw err;
  }
};

export default getOpenAIAPIResponse;
