const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const db = new Database("survey.db", { readonly: true });

db.pragma("journal_mode = WAL");

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/questions", (_req, res) => {
  const rows = db.prepare(`
    SELECT q.id AS qid, q.title, o.letter, o.text
    FROM questions q
    JOIN options o ON o.question_id = q.id
    ORDER BY q.sort_order, o.letter
  `).all();

  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.qid)) {
      map.set(row.qid, { title: row.title, options: [] });
    }
    map.get(row.qid).options.push({ letter: row.letter, text: row.text });
  }

  res.json([...map.values()]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
