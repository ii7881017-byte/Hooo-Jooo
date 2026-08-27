import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Assistant endpoint for utility tools (Summarize, Rephrase, Translate, Code explanation, Regex generation)
  app.post("/api/ai-tool", async (req, res) => {
    try {
      const { toolType, input, targetLanguage, tone, extra } = req.body;

      if (!input || typeof input !== "string" || input.trim() === "") {
        return res.status(400).json({ error: "Input text is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "Gemini API key is not configured yet. You can still use all 15+ built-in offline tools directly!",
          isApiKeyMissing: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      let systemPrompt = "You are a versatile, precise digital utility assistant. Provide direct, clean, and helpful results without unnecessary filler.";
      let userPrompt = "";

      switch (toolType) {
        case "translate":
          systemPrompt = `You are an expert multilingual translator. Translate the text accurately into ${targetLanguage || "Arabic"}. Preserve formatting, technical terms, and tone.`;
          userPrompt = `Translate the following text to ${targetLanguage || "Arabic"}:\n\n${input}`;
          break;
        case "rephrase":
          systemPrompt = `You are a writing assistant. Rephrase the input text in a ${tone || "professional"} tone while preserving the original meaning.`;
          userPrompt = `Rephrase this text:\n\n${input}`;
          break;
        case "summarize":
          systemPrompt = "You are an executive summarizer. Provide a clear summary with key bullet points.";
          userPrompt = `Summarize the following content effectively:\n\n${input}`;
          break;
        case "code-explain":
          systemPrompt = "You are a senior software engineer. Explain the following code clearly, identifying potential optimizations and bug risks.";
          userPrompt = `Explain and analyze this code:\n\n${input}`;
          break;
        case "regex-gen":
          systemPrompt = "You are a regular expression specialist. Generate the optimal regex with flags and a clear breakdown of each token.";
          userPrompt = `Create a regex for this requirement:\n\n${input}\nAdditional context: ${extra || "None"}`;
          break;
        default:
          userPrompt = input;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
        },
      });

      const text = response.text || "";
      return res.json({ result: text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to process AI utility request",
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Digital Utility Tools Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
