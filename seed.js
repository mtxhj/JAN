const Database = require("better-sqlite3");
const db = new Database("survey.db");

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id         INTEGER PRIMARY KEY,
    sort_order INTEGER NOT NULL,
    title      TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS options (
    id          INTEGER PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES questions(id),
    letter      TEXT    NOT NULL,
    text        TEXT    NOT NULL
  );
`);

const questions = [
  {
    sort_order: 1,
    title: "1. Which programming language do you use most frequently?",
    options: [
      { letter: "A", text: "JavaScript" },
      { letter: "B", text: "Python" },
      { letter: "C", text: "Java" },
      { letter: "D", text: "C++" },
    ],
  },
  {
    sort_order: 2,
    title: "2. What is your preferred development environment?",
    options: [
      { letter: "A", text: "VS Code" },
      { letter: "B", text: "IntelliJ IDEA" },
      { letter: "C", text: "Vim / Neovim" },
      { letter: "D", text: "Sublime Text" },
    ],
  },
  {
    sort_order: 3,
    title: "3. How many years of programming experience do you have?",
    options: [
      { letter: "A", text: "Less than 1 year" },
      { letter: "B", text: "1 – 3 years" },
      { letter: "C", text: "3 – 5 years" },
      { letter: "D", text: "More than 5 years" },
    ],
  },
];

const insertQuestion = db.prepare(
  "INSERT INTO questions (sort_order, title) VALUES (?, ?)"
);
const insertOption = db.prepare(
  "INSERT INTO options (question_id, letter, text) VALUES (?, ?, ?)"
);

const seedAll = db.transaction(() => {
  db.exec("DELETE FROM options");
  db.exec("DELETE FROM questions");

  for (const q of questions) {
    const { lastInsertRowid } = insertQuestion.run(q.sort_order, q.title);
    for (const opt of q.options) {
      insertOption.run(lastInsertRowid, opt.letter, opt.text);
    }
  }
});

seedAll();
console.log("Database seeded: 3 questions, 12 options.");
db.close();
