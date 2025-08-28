// -------------------- Imports --------------------
import dotenv from "dotenv";
dotenv.config(); // Load .env file

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

// Models
import Note from "./models/Note.js";
import Video from "./models/Video.js";
import Tool from "./models/Tool.js";

import path from "path";
import { fileURLToPath } from "url";

// -------------------- Express App --------------------
const app = express();
app.use(cors());
app.use(bodyParser.json());

// -------------------- MongoDB Connection --------------------
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// -------------------- Notes Routes --------------------
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err.message });
  }
});

app.post("/notes", async (req, res) => {
  const { title, fileUrl, category } = req.body;
  try {
    const note = new Note({ title, fileUrl, category });
    await note.save();
    res.json({ message: "Note added", note });
  } catch (err) {
    res.status(500).json({ message: "Failed to add note", error: err.message });
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Note updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

// -------------------- Videos Routes --------------------
app.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos", error: err.message });
  }
});

app.post("/videos", async (req, res) => {
  const { title, videoUrl, category } = req.body;
  try {
    const video = new Video({ title, videoUrl, category });
    await video.save();
    res.json({ message: "Video added", video });
  } catch (err) {
    res.status(500).json({ message: "Failed to add video", error: err.message });
  }
});

app.put("/videos/:id", async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Video updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

app.delete("/videos/:id", async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

// -------------------- Tools Routes --------------------
app.get("/tools", async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tools", error: err.message });
  }
});

app.post("/tools", async (req, res) => {
  const { name, imageUrl, description, category } = req.body;
  try {
    const tool = new Tool({ name, imageUrl, description, category });
    await tool.save();
    res.json({ message: "Tool added", tool });
  } catch (err) {
    res.status(500).json({ message: "Failed to add tool", error: err.message });
  }
});

app.put("/tools/:id", async (req, res) => {
  try {
    await Tool.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Tool updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

app.delete("/tools/:id", async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: "Tool deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

// -------------------- Static Files --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// -------------------- Frontend API Helpers --------------------
const API = "http://localhost:5000"; // apna backend ka API yaha daal

// -------- Helper function --------
async function apiCall(url, method, body = null) {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });
    if (!res.ok) throw new Error("Server error");
    return await res.json();
  } catch (err) {
    alert(⚠️ Server se connect nahi ho paaya, check backend!");
    console.error(err);
    return null;
  }
}

// -------- Add Note --------
async function addNote() {
  const title = document.getElementById("noteTitle").value.trim();
  const fileUrl = document.getElementById("noteFile").value.trim();
  const category = document.getElementById("noteCategory").value;

  if (!title || !fileUrl) {
    alert("⚠️ Title aur File URL required hai!");
    return;
  }

  const res = await apiCall(API + "/notes", "POST", { title, fileUrl, category });
  if (res) {
    alert("✅ Note added successfully!");
    loadNotes();
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteFile").value = "";
  }
}

// -------- Add Video --------
async function addVideo() {
  const title = document.getElementById("videoTitle").value.trim();
  const videoUrl = document.getElementById("videoUrl").value.trim();
  const category = document.getElementById("videoCategory").value;

  if (!title || !videoUrl) {
    alert("⚠️ Title aur Video URL required hai!");
    return;
  }

  const res = await apiCall(API + "/videos", "POST", { title, videoUrl, category });
  if (res) {
    alert("✅ Video added successfully!");
    loadVideos();
    document.getElementById("videoTitle").value = "";
    document.getElementById("videoUrl").value = "";
  }
}

// -------- Add Tool --------
async function addTool() {
  const name = document.getElementById("toolName").value.trim();
  const imageUrl = document.getElementById("toolImg").value.trim();
  const description = document.getElementById("toolDesc").value.trim();
  const category = document.getElementById("toolCategory").value;

  if (!name || !imageUrl) {
    alert("⚠️ Tool Name aur Image URL required hai!");
    return;
  }

  const res = await apiCall(API + "/tools", "POST", { name, imageUrl, description, category });
  if (res) {
    alert("✅ Tool added successfully!");
    loadTools();
    document.getElementById("toolName").value = "";
    document.getElementById("toolImg").value = "";
    document.getElementById("toolDesc").value = "";
  }
}
