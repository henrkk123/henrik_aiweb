// Express router for the /chat endpoint.
const express = require("express");
const { buildPrompt } = require("./buildPrompt");
const { callLLM } = require("./aiClient");
const { getConfigs } = require("./configLoader");

function createChatRoute(preloadedConfigs) {
  const router = express.Router();
  const configs = preloadedConfigs || getConfigs();
  const FALLBACK_REPLY = "Der KI-Server ist nicht erreichbar.";

  router.post("/", async (req, res) => {
    try {
      const { message, history } = req.body || {};
      if (!message) {
        return res.status(400).json({ error: "Missing 'message' in body." });
      }

      const messages = buildPrompt(
        configs.businessConfig,
        configs.aiConfig,
        message,
        Array.isArray(history) ? history : []
      );

      const reply = await callLLM(messages, configs.llmConfig);
      return res.json({ reply });
    } catch (error) {
      console.error("Error handling /chat request:", error);
      return res.json({ reply: FALLBACK_REPLY });
    }
  });

  return router;
}

module.exports = createChatRoute;
