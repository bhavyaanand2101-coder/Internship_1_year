import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
    try {
        const { system, prompt } = req.body;
        const apiKey = (process.env.GEMINI_API_KEY || "").trim();

        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not defined in the environment." });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                systemInstruction: {
                    parts: [
                        {
                            text: system
                        }
                    ]
                }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            const errMsg = data.error?.message || "Error calling Gemini API";
            return res.status(response.status).json({ error: errMsg });
        }

        // Extract text response from Gemini API structure
        const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Format to match the Anthropic API structure expected by the React frontend
        res.json({
            content: [
                {
                    type: "text",
                    text: geminiText
                }
            ]
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3001, () => console.log("Server on :3001"));