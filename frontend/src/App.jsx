import { useState, useEffect } from 'react';
import useGameSession from './hooks/useGameSession';

import QuestionCard from './components/QuestionCard';
import FeedbackChart from './components/FeedbackChart';
import ProfessorAvatar from './components/ProfessorAvatar';
import ScoreTracker from './components/ScoreTracker';
import NextButton from './components/NextButton';

import logo from './assets/thelawlab-logo.png';



function App() {

  const [hasStarted, setHasStarted] = useState(false);
  const game = useGameSession();
  const showUI = game.hasStarted;


  const [chartData, setChartData] = useState(() => {
    const saved = localStorage.getItem('feedbackHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // On initial load, reset feedback history
    localStorage.removeItem('feedbackHistory');
    setChartData([]);

    function handleUpdate() {
      const saved = localStorage.getItem('feedbackHistory');
      setChartData(saved ? JSON.parse(saved) : []);
    }

    window.addEventListener('feedbackUpdated', handleUpdate);
    return () => window.removeEventListener('feedbackUpdated', handleUpdate);
  }, []);

  // Editable test settings
  const TOTAL_TEST_TIME = 120 * 60; // 2 hours in seconds
  const TOTAL_QUESTIONS = 60;
  const AVG_TIME_PER_QUESTION = TOTAL_TEST_TIME / TOTAL_QUESTIONS;



  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div className="text-xl font-bold flex items-center space-x-2">
          <img src={logo} alt="The Law Lab logo" className="h-8 w-8" />
          <span>The Law Lab</span>
        </div>
        <div>
          <button className="text-sm text-blue-600 hover:underline">Log In</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
          
          {/* Left Professors */}
          <div className="col-span-1 flex flex-col items-center space-y-4">
            {showUI ? (
              <>
                <ProfessorAvatar
                  answered={game.answered}
                  correct={game.selected === game.currentQuestion.correct_answer}
                  professor="veritas"
                  question={game.currentQuestion}
                />
                <ProfessorAvatar
                  answered={game.answered}
                  correct={game.selected === game.currentQuestion.correct_answer}
                  professor="oak"
                  question={game.currentQuestion}
                />
              </>
            ) : null}
          </div>
          
          <div className="col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <QuestionCard
                question={game.currentQuestion}
                answered={game.answered}
                selected={game.selected}
                submitAnswer={game.submitAnswer}
              />

              <div className="flex justify-between items-center">
                {showUI && <ScoreTracker score={game.score} />}
                {showUI && (
                  <div className="text-sm text-gray-600 text-center">
                    Time spent on correct answers: {Math.floor(game.correctTime)}s
                  </div>
                )}
                {showUI && <NextButton onClick={game.next} />}
              </div>

              {showUI && (
                <div className="w-full">
                  <FeedbackChart data={chartData} avgTime={AVG_TIME_PER_QUESTION} />
                </div>
              )}
            </div>
          </div>


          {/* Right Professors */}
          <div className="col-span-1 flex flex-col items-center space-y-4">
            {showUI ? (
              <>
                <ProfessorAvatar
                  answered={game.answered}
                  correct={game.selected === game.currentQuestion.correct_answer}
                  professor="strickland"
                  question={game.currentQuestion}
                />
                <ProfessorAvatar
                  answered={game.answered}
                  correct={game.selected === game.currentQuestion.correct_answer}
                  professor="calder"
                  question={game.currentQuestion}
                />
              </>
            ) : null}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        
      </footer>
    </div>
  );
}

export default App;
