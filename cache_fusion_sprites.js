const sqlite3 = require("sqlite3").verbose();
const cheerio = require("cheerio");

const db = new sqlite3.Database("pokedex.db");

function slugifyPokemonName(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace("♀", "-f")
    .replace("♂", "-m")
    .replace("mr. mime", "mr-mime")
    .replace(/\s+/g, "-");
}

async function getFusionSpriteUrl(name) {
  const slug = slugifyPokemonName(name);
  const url = `https://www.fusiondex.org/${slug}/`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  return $("img.sprite").first().attr("src");
}

db.all("SELECT number, name FROM pokemon ORDER BY number", async (err, rows) => {
  if (err) {
    console.error(err);
    db.close();
    return;
  }

  for (const row of rows) {
    try {
      let spriteUrl;

      if (row.number === 0) {
        spriteUrl = "media/missingno_front.png";
      } else {
        spriteUrl = await getFusionSpriteUrl(row.name);
      }

      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE pokemon SET picture = ? WHERE number = ?",
          [spriteUrl, row.number],
          error => error ? reject(error) : resolve()
        );
      });

      console.log(`${row.number}: ${row.name} → ${spriteUrl}`);
    } catch (error) {
      console.error(`Failed for ${row.name}:`, error.message);
    }
  }

  db.close();
  console.log("Done caching FusionDex sprites.");
});