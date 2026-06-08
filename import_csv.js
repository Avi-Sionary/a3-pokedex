const fs = require("fs");
const csv = require("csv-parser");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("pokedex.db");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS pokemon");

db.run(`
  CREATE TABLE pokemon (
    number INTEGER PRIMARY KEY,
    formatted_number TEXT,
    picture TEXT,
    name TEXT,
    entry TEXT,
    category TEXT,
    type1 TEXT,
    type2 TEXT,
    height_m REAL,
    weight_kg REAL,
    ability1 TEXT,
    ability2 TEXT,
    hidden_ability TEXT,
    regional_variant TEXT,
    form TEXT,
    habitat TEXT
  )
`);

  const stmt = db.prepare(`
    INSERT INTO pokemon (
      number,
      formatted_number,
      picture,
      name,
      entry,
      category,
      type1,
      type2,
      height_m,
      weight_kg,
      ability1,
      ability2,
      hidden_ability,
      regional_variant,
      form,
      habitat
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  fs.createReadStream("Pokédex - Converted Dex.csv")
    .pipe(csv())
    .on("data", row => {
      stmt.run(
        Number(row["#"]),
        row["#"],
        row["Picture"],
        row["Name"],
        row["Entry"],
        row["Category"],
        row["Type 1"],
        row["Type 2"],
        Number(row["Ht (m)"]),
        Number(row["Wt (kg)"]),
        row["Ability 1"],
        row["Ability 2"],
        row["Hidden Ability"],
        row["Regional Variant"],
        row["Form"],
        row["Habitat"]
      );
    })
    .on("end", () => {
      stmt.finalize();
      db.close();
      console.log("CSV imported into pokedex.db");
    });
});