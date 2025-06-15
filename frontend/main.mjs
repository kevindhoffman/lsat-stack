let currentQuestion = null;
let startTime = null;

function renderQuestion(q) {
  currentQuestion = q;
  startTime = Date.now();

  document.getElementById("stimulus").innerText = q.stimulus;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  for (const [key, value] of Object.entries(q.choices)) {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.innerText = `${key}: ${value}`;
    btn.onclick = () => submitAnswer(key);
    choicesDiv.appendChild(btn);
  }

  document.getElementById("feedback-box").classList.add("hidden");
}

async function fetchQuestion() {
  const res = await fetch("http://localhost:8000/api/question");
  const question = await res.json();
  renderQuestion(question);
}

async function submitAnswer(choice) {
  const timeSec = (Date.now() - startTime) / 1000;

  const res = await fetch("http://localhost:8000/api/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question_id: currentQuestion.question_id,
      answer: choice,
      time_sec: timeSec
    })
  });

  const result = await res.json();
  document.getElementById("feedback-box").classList.remove("hidden");

  for (const prof in result.professors) {
    const div = document.getElementById(prof);
    div.innerText = result.professors[prof][result.correct ? "correct" : "incorrect"];
  }
}

fetchQuestion();
