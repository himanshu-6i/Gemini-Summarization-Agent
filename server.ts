import "dotenv/config";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApiRouter() {
  const router = express.Router();

  router.post("/agent", async (req, res) => {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !apiKey || 
                          apiKey.trim() === "" || 
                          apiKey === "MY_GEMINI_API_KEY" || 
                          apiKey === "GEMINI_API_KEY";

    if (isPlaceholder) {
      console.error("CRITICAL: GEMINI_API_KEY is not configured. Current value:", apiKey);
      return res.status(500).json({ 
        error: "AI Agent configuration error: Missing or invalid API Key",
        message: "Please ensure GEMINI_API_KEY is set in your environment variables and is not a placeholder value."
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the following text concisely:\n\n${input}`,
        config: {
          systemInstruction: "You are a professional summarization agent. Provide a clear, concise summary of the input text.",
        },
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("Agent Error:", error);
      res.status(500).json({ error: "Failed to process request", details: error.message });
    }
  });

  return router;
}

export async function createApp() {
  const app = express();
  app.use(express.json());

  // Mount API routes
  app.use("/api", createApiRouter());

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

// Only listen if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = 3000;
  createApp().then(app => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
