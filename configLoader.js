// Loads and validates configuration files from ./config and ensures .env is read.
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, ".env") });

function readJSON(fileName) {
  const filePath = path.join(__dirname, "config", fileName);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to load config ${fileName}: ${error.message}`);
    throw error;
  }
}

function getConfigs() {
  const businessConfig = readJSON("business.config.json");
  const aiConfig = readJSON("ai.config.json");
  const llmConfig = readJSON("llm.config.json");
  return { businessConfig, aiConfig, llmConfig };
}

module.exports = { getConfigs };
