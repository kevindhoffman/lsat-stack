import { useState, useEffect } from 'react';

import questions from '../questions.json';

export default function useGameSession() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [hasStarted, setHasStarted] = useState(false);
  const [correctTime, setCorrectTime] = useState(0); // in seconds

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

function submitAnswer(letter) {
  console.log('submitAnswer called. answered?', answered);
  if (answered) {
    console.log('Blocked because already answered.');
    return;
  }

  setSelected(letter);
  setAnswered(true);
  setHasStarted(true);

  const isCorrect = letter === currentQuestion.correct_answer;
  if (isCorrect) {
    setScore((s) => s + 1);
    setCorrectTime((t) => t + duration);
  }

  const duration = (Date.now() - startTime) / 1000;
  const expected = currentQuestion.expected_time ?? 30;
  const perfectTime = 6; // seconds

  let efficiency;
  if (duration > expected) {
    efficiency = 0;
  } else if (duration <= perfectTime) {
    efficiency = 100;
  } else {
    efficiency = Math.round(100 * ((expected - duration) / (expected - perfectTime)));
  }

  const feedbackPoint = {
    x: efficiency,
    y: currentQuestion.logical_complexity,
    type: currentQuestion.category,
    correct: isCorrect
  };

  const existing = JSON.parse(localStorage.getItem('feedbackHistory') || '[]');
  existing.push(feedbackPoint);
  localStorage.setItem('feedbackHistory', JSON.stringify(existing));
  window.dispatchEvent(new Event('feedbackUpdated'));

  console.log('Logging for chart:', feedbackPoint);
}


  function next() {
    console.log('Advancing to next question...');
    setAnswered(false);
    setSelected(null);
    setCurrentIndex((i) => i + 1);
  }

  return {
    currentQuestion,
    currentIndex,
    score,
    answered,
    selected,
    submitAnswer,
    next,
    correctTime,
    hasStarted,
    isFinished: currentIndex >= questions.length - 1
  };
}
