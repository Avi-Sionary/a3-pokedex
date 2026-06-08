const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const db = new sqlite3.Database("pokedex.db");

app.use(cors());
app.use(express.static(__dirname));

app.get("/api/pokemon", (req, res) => {
  db.all("SELECT * FROM pokemon ORDER BY number", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/pokemon/:number", (req, res) => {
    db.get(
        "SELECT * FROM pokemon WHERE number = ?",
        [req.params.number],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({ error: "Pokemon not found" });
            }

            res.json(row);
        }
    );
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});