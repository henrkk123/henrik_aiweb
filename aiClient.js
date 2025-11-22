// Generic AI client for calling the Groq OpenAI-compatible chat API using fetch.
const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "llama-3.1-8b-instant";
const FALLBACK_REPLY = "Der KI-Server ist nicht erreichbar.";

async function callLLM(messages = [], llmConfig = {}) {
  const apiKey = process.env[llmConfig.api_key_env || "LLM_API_KEY"];

  if (!apiKey) {
    console.warn(
      `No API key found in env variable ${llmConfig.api_key_env || "LLM_API_KEY"}`
    );
  }

  const baseUrl = (llmConfig.base_url || DEFAULT_BASE_URL).replace(/\/$/, "");
  const endpoint = `${baseUrl}/chat/completions`;

  const body = {
    model: llmConfig.model || DEFAULT_MODEL,
    messages,
    temperature: 0.3
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey || ""}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LLM request failed:", errorText);
      return FALLBACK_REPLY;
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("LLM response missing reply text:", data);
      return FALLBACK_REPLY;
    }

    return reply;
  } catch (error) {
    console.error("LLM request failed:", error);
    return FALLBACK_REPLY;
  }
}

module.exports = { callLLM };
