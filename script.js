const questions = [
  {
    title: "1. Which programming language do you use most frequently?",
    options: [
      { letter: "A", text: "JavaScript" },
      { letter: "B", text: "Python" },
      { letter: "C", text: "Java" },
      { letter: "D", text: "C++" },
    ],
  },
  {
    title: "2. What is your preferred development environment?",
    options: [
      { letter: "A", text: "VS Code" },
      { letter: "B", text: "IntelliJ IDEA" },
      { letter: "C", text: "Vim / Neovim" },
      { letter: "D", text: "Sublime Text" },
    ],
  },
  {
    title: "3. How many years of programming experience do you have?",
    options: [
      { letter: "A", text: "Less than 1 year" },
      { letter: "B", text: "1 – 3 years" },
      { letter: "C", text: "3 – 5 years" },
      { letter: "D", text: "More than 5 years" },
    ],
  },
];

let currentIndex = 0;
const answers = {};

const questionTitle = document.getElementById("questionTitle");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");
const resultSummary = document.getElementById("resultSummary");

function renderQuestion() {
  const q = questions[currentIndex];
  questionTitle.textContent = q.title;

  optionsContainer.innerHTML = q.options
    .map(
      (opt) => `
    <label class="option-label" data-letter="${opt.letter}">
      <input type="radio" name="q${currentIndex}" value="${opt.letter}">
      <span class="option-letter">${opt.letter}</span>
      <span class="option-text">${opt.text}</span>
    </label>
  `
    )
    .join("");

  // Restore previous selection if user went back (future feature)
  if (answers[currentIndex]) {
    const prev = optionsContainer.querySelector(
      `input[value="${answers[currentIndex]}"]`
    );
    if (prev) {
      prev.checked = true;
      prev.closest(".option-label").classList.add("selected");
    }
  }

  nextBtn.disabled = !answers[currentIndex];
  updateButtonText();
  updateProgress();
  bindOptionEvents();
}

function bindOptionEvents() {
  const labels = optionsContainer.querySelectorAll(".option-label");
  labels.forEach((label) => {
    label.addEventListener("click", () => {
      labels.forEach((l) => l.classList.remove("selected"));
      label.classList.add("selected");
      label.querySelector("input").checked = true;
      answers[currentIndex] = label.dataset.letter;
      nextBtn.disabled = false;
    });
  });
}

function updateProgress() {
  const pct = ((currentIndex + 1) / questions.length) * 100;
  progressFill.style.width = pct + "%";
  progressText.textContent = `${currentIndex + 1} / ${questions.length}`;
}

function updateButtonText() {
  nextBtn.textContent =
    currentIndex === questions.length - 1 ? "Submit" : "Next";
}

function showResults() {
  questionPage.classList.add("hidden");
  resultPage.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  progressText.textContent = "Completed";
  progressFill.style.width = "100%";

  resultSummary.innerHTML = questions
    .map((q, i) => {
      const chosen = q.options.find((o) => o.letter === answers[i]);
      return `
      <div class="result-item">
        <div class="result-question">${q.title}</div>
        <div class="result-answer">${chosen.letter}. ${chosen.text}</div>
      </div>
    `;
    })
    .join("");
}

nextBtn.addEventListener("click", () => {
  if (!answers[currentIndex]) return;
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResults();
  }
});

renderQuestion();
