const quizContainer = document.getElementById('quiz');
const nextBtn = document.getElementById('nextBtn');
const ageGroup = localStorage.getItem('ageGroup');

const quizData = {
  "8-12": [
    { q: "What is the right to education?", a: ["Right to play", "Right to learn at school", "Right to eat", 1], exp: "Every child has the right to go to school and learn." },
    { q: "Who protects children’s rights in India?", a: ["Police", "Parents", "Government", 2], exp: "The government ensures children’s rights through laws and policies." },
    { q: "Every child has the right to be ___", a: ["Safe", "Hungry", "Ignored", 0], exp: "All children must be kept safe from harm or abuse." },
    { q: "Which of these is a basic right?", a: ["Right to sleep late", "Right to protection", "Right to shout", 1], exp: "The right to protection is one of the fundamental rights." },
    { q: "What should every child go to?", a: ["Work", "School", "Market", 1], exp: "Education is every child’s right, not work." }
  ],
  "13-16": [
    { q: "Which law protects child rights in India?", a: ["PETA Act", "POCSO Act", "Motor Act", 1], exp: "The POCSO Act protects children from sexual abuse." },
    { q: "Right to participation means?", a: ["Children should stay silent", "Children can express opinions", "Children must work", 1], exp: "Children have the right to share their views in matters that affect them." },
    { q: "Child labour is illegal under what age?", a: ["12", "14", "18", 1], exp: "Children under 14 cannot be employed in any occupation." },
    { q: "UNCRC stands for?", a: ["UN Child Rights Convention", "UN Citizen Rights Charter", "UN Child Resource Council", 0], exp: "It stands for United Nations Convention on the Rights of the Child." },
    { q: "Who ensures education for children in India?", a: ["RTE Act", "GST Act", "IT Act", 0], exp: "The Right to Education (RTE) Act ensures free and compulsory education for children." }
  ]
};

const questions = quizData[ageGroup] || [];

let current = 0;
let score = 0;
let timer = null;
const timePerQuestion = 15;
let timeLeft = timePerQuestion;
let userAnswers = new Array(questions.length).fill(null);
let quizFinished = false;

function createProgressAndTimer() {
  const existing = document.querySelector('.progress-container');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.classList.add('progress-container');
  container.innerHTML = `
    <div id="progress-bar" class="progress-bar"></div>
    <div id="timer" class="timer">⏱️ ${timePerQuestion}s</div>
  `;
  quizContainer.insertAdjacentElement('beforebegin', container);
}

function updateProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const percent = (current / questions.length) * 100;
  bar.style.width = `${percent}%`;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = timePerQuestion;
  const timerDisplay = document.getElementById('timer');
  if (!timerDisplay) return;

  timerDisplay.textContent = `⏱️ ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱️ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(null); // auto-skip
    }
  }, 1000);
}

function showQuestion() {
  if (quizFinished) return;
  if (current >= questions.length) return showResults();

  const q = questions[current];
  quizContainer.innerHTML = `
    <h3>${current + 1}. ${q.q}</h3>
    ${q.a.slice(0, -1).map((opt, i) =>
      `<button class='option-btn' onclick='checkAnswer(${i})'>${opt}</button>`
    ).join('')}
  `;

  updateProgress();
  startTimer();
}

function checkAnswer(selectedIndex) {
  userAnswers[current] = selectedIndex;
  const correctIndex = questions[current].a[3];
  if (selectedIndex === correctIndex) score++;
  current++;
  clearInterval(timer);
  showQuestion();
}

function showResults() {
  quizFinished = true;
  clearInterval(timer);
  nextBtn.style.display = "none";

  updateProgress();
  document.getElementById('progress-bar').style.width = "100%";

  let html = `<h2>You scored ${score}/${questions.length}!</h2><h3>Answers & Explanations</h3>`;
  questions.forEach((q, i) => {
    const correctIndex = q.a[3];
    const userIndex = userAnswers[i];
    const optsHtml = q.a.slice(0, -1).map((opt, j) => {
      const classes = [];
      if (j === correctIndex) classes.push('option-correct');
      if (userIndex === j && userIndex !== correctIndex) classes.push('option-wrong');
      return `<div class="result-option ${classes.join(' ')}">${opt}${userIndex === j ? ' <strong>(your choice)</strong>' : ''}</div>`;
    }).join('');

    const noAns = userIndex === null ? `<p class="no-answer">You did not answer this question.</p>` : '';
    html += `
      <div class="result-item">
        <p><strong>Q${i + 1}:</strong> ${q.q}</p>
        ${optsHtml}
        ${noAns}
        <p class="explanation">💡 ${q.exp}</p>
      </div>
    `;
  });

  html += `<button id="retryBtn" class="quiz-btn">🔁 Try Again</button>`;
  quizContainer.innerHTML = html;
  document.getElementById('retryBtn').addEventListener('click', restartQuiz);
}

function restartQuiz() {
  current = 0;
  score = 0;
  userAnswers = new Array(questions.length).fill(null);
  quizFinished = false;
  nextBtn.style.display = "inline-block";
  createProgressAndTimer();
  showQuestion();
}

window.checkAnswer = checkAnswer;

document.addEventListener("DOMContentLoaded", () => {
  createProgressAndTimer();
  showQuestion();
});
