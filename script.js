const quizContainer = document.getElementById('quiz');
const nextBtn = document.getElementById('nextBtn');

const ageGroup = localStorage.getItem('ageGroup');

const quizData = {
  "8-12": [
    { q: "What is the right to education?", a: ["Right to play", "Right to learn at school", "Right to eat", 1] },
    { q: "Who protects children’s rights in India?", a: ["Police", "Parents", "Government", 2] },
    { q: "Every child has the right to be ___", a: ["Safe", "Hungry", "Ignored", 0] },
    { q: "Which of these is a basic right?", a: ["Right to sleep late", "Right to protection", "Right to shout", 1] },
    { q: "What should every child go to?", a: ["Work", "School", "Market", 1] }
  ],
  "13-16": [
    { q: "Which law protects child rights in India?", a: ["PETA Act", "POCSO Act", "Motor Act", 1] },
    { q: "Right to participation means?", a: ["Children should stay silent", "Children can express opinions", "Children must work", 1] },
    { q: "Child labour is illegal under what age?", a: ["12", "14", "18", 1] },
    { q: "UNCRC stands for?", a: ["UN Child Rights Convention", "UN Citizen Rights Charter", "UN Child Resource Council", 0] },
    { q: "Who ensures education for children in India?", a: ["RTE Act", "GST Act", "IT Act", 0] }
  ]
};

let current = 0;
let score = 0;
const questions = quizData[ageGroup] || [];

function showQuestion() {
  if (current >= questions.length) {
    quizContainer.innerHTML = `<h2>You scored ${score}/${questions.length}!</h2>`;
    nextBtn.style.display = "none";
    return;
  }

  const q = questions[current];
  quizContainer.innerHTML = `
    <h3>${q.q}</h3>
    ${q.a.slice(0, -1).map((opt, i) =>
      `<button class='option-btn' onclick='checkAnswer(${i})'>${opt}</button>`
    ).join('')}
  `;
}

function checkAnswer(i) {
  const correct = questions[current].a[3];
  if (i === correct) score++;
  current++;
  showQuestion();
}

nextBtn.addEventListener('click', showQuestion);
showQuestion();
