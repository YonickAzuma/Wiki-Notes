const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const DATA_FILE = "data.json";
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

app.get("/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(Object.keys(notes));
});

app.get("/notes/:title", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(DATA_FILE));
  const title = req.params.title;
  res.json(notes[title] || { content: "", image: "" });
});

app.post("/notes/:title", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(DATA_FILE));
  const title = req.params.title;
  notes[title] = { content: req.body.content, image: req.body.image || "" };
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
  res.json({ message: "✅ Tersimpan!" });
});

app.delete("/notes/:title", (req, res) => {
  const notes = JSON.parse(fs.readFileSync(DATA_FILE));
  const title = req.params.title;
  if (notes[title]) {
    delete notes[title];
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
    res.json({ message: "🗑️ Catatan dihapus!" });
  } else {
    res.status(404).json({ message: "❌ Catatan tidak ditemukan!" });
  }
});

app.listen(3000, () => console.log("🔥 Server jalan di http://localhost:3000"));
