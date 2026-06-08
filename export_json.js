const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("pokedex.db");

db.all("SELECT * FROM pokemon ORDER BY number", [], (err, rows) => {
  if (err) {
    console.error(err);
    db.close();
    return;
  }

  fs.writeFileSync("pokemon.json", JSON.stringify(rows, null, 2));

  db.close();
  console.log("Exported pokemon.json");
});