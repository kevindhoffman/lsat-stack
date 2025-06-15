// frontend/main.mjs
const isLocal = window.location.hostname === "localhost";
const API_BASE_URL = isLocal
  ? "http://localhost:8000"
  : "https://lsat-stack.onrender.com";


let currentQuestion = null;
let startTime = null;
const chartCanvas = document.getElementById("feedback-chart");
const ctx = chartCanvas.getContext("2d");
const chartPoints = [];
const categoryIcons = {
  vocabulary: "assets/vocab.png",
  reading: "assets/reading.png",
  analytical: "assets/analytical.png",
  inference: "assets/inference.png",
  argumentation: "assets/balance.png",
  logic: "assets/logic.png"
};
const chartWrapper = document.getElementById("chart-wrapper");
let hasAnsweredFirstQuestion = false;


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

  document.getElementById("next-btn").classList.add("hidden");

  // ["veritas", "oak", "strickland", "calder"].forEach(id => {
  //   const card = document.getElementById(id);
  //   card.classList.remove("correct", "incorrect");
  //   card.classList.add("hidden");
  //   card.querySelector(".professor-quote").innerText = "";
  // });

  // chartWrapper.classList.add("hidden");

  ["veritas", "oak", "strickland", "calder"].forEach(id => {
    const card = document.getElementById(id);
    card.classList.remove("correct", "incorrect");
    card.querySelector(".professor-quote").innerText = "";
    if (!hasAnsweredFirstQuestion) {
      card.classList.add("hidden");
    }
  });

  if (!hasAnsweredFirstQuestion) {
    chartWrapper.classList.add("hidden");
  }



}

async function fetchQuestion() {
  const res = await fetch(`${API_BASE_URL}/api/question`);
  const question = await res.json();
  renderQuestion(question);
}

async function submitAnswer(choice) {
  const timeSec = (Date.now() - startTime) / 1000;
  chartWrapper.classList.remove("hidden");

  const res = await fetch(`${API_BASE_URL}/api/submit`, {
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

  ["veritas", "oak", "strickland", "calder"].forEach(id => {
    const card = document.getElementById(id);
    card.classList.remove("hidden");
    card.classList.remove("correct", "incorrect");
    card.classList.add(result.correct ? "correct" : "incorrect");

    const quote =
      result.professors?.[id]?.[result.correct ? "correct" : "incorrect"] || "";

    card.querySelector(".professor-quote").innerText = quote;
  });

  const x = currentQuestion.logical_complexity || 50;
  const expected = currentQuestion.expected_time_sec || 20;
  const actual = timeSec;
  let efficiency = 100 - Math.min(100, (actual / expected) * 100);
  efficiency = Math.max(0, efficiency);
  const y = efficiency;

  chartPoints.push({
    x,
    y,
    correct: result.correct,
    category: currentQuestion.category || "logic"
  });

  drawChart();
  
  hasAnsweredFirstQuestion = true;

  chartWrapper.classList.remove("hidden");

  document.getElementById("next-btn").classList.remove("hidden");
}

function drawChart() {
  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  chartPoints.forEach(point => {
    const icon = new Image();
    icon.src = categoryIcons[point.category] || categoryIcons.logic;
    const xPos = (point.x / 100) * chartCanvas.width - 12;
    const yPos = chartCanvas.height - (point.y / 100) * chartCanvas.height - 12;
    icon.onload = () => {
      ctx.drawImage(icon, xPos, yPos, 24, 24);
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ["veritas", "oak", "strickland", "calder"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  chartWrapper.classList.add("hidden");

  const nextBtn = document.getElementById("next-btn");
  nextBtn.onclick = fetchQuestion;

});

fetchQuestion();
