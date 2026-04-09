import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "YOUR_CLAUDE_API_KEY_HERE";

// simple memory
let conversation = [];

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    // save user message
    conversation.push({ role: "user", content: userMessage });

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: [
                    {
                        role: "system",
                        content: "You are a friendly, smart AI assistant. Explain things clearly and naturally."
                    },
                    ...conversation
                ]
            })
        });

        const data = await response.json();
        const reply = data?.content?.[0]?.text || "No response";

        // save AI reply
        conversation.push({ role: "assistant", content: reply });

        res.json({ reply });

    } catch (err) {
        res.status(500).json({ error: "AI brain failed 😵" });
    }
});

app.listen(3000, () => {
    console.log("🧠 AI brain running on http://localhost:3000");
});
