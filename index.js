// Entry point for the Express server.
require("dotenv").config();
const express = require("express");
const { getConfigs } = require("./configLoader");
const createChatRoute = require("./chatRoute");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let configs;
try {
  configs = getConfigs();
  console.log("Configs loaded. Starting AI Receptionist server...");
} catch (error) {
  console.error("Failed to load configs on startup:", error);
  process.exit(1);
}

app.use("/chat", createChatRoute(configs));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.on("error", (err) => {
  console.error("Server encountered an error:", err);
});
