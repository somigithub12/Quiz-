import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(600); // 10 minutes = 600 seconds
  const [gameOver, setGameOver] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement);

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => setQuestions(data));
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setGameOver(true);
    }
    const interval = setInterval(() => {
      setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleAnswerClick = (option) => {
    if (option === questions[currentQuestionIndex].answer) {
      setScore(prevScore => prevScore + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const requestFullScreen = () => {
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  };

  if (!isFullScreen) {
    return (
      <div className="fullscreen-popup">
        <div className="fullscreen-message">
          <h2>Please enable full-screen mode to start the quiz</h2>
          <button onClick={requestFullScreen} className="fullscreen-button">Go Full Screen</button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="quiz-container">
        <h1>Game Over</h1>
        <p>Your score: {score}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="quiz-container">
      <div className="quiz-box">
        <div className="timer">Time left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
        <h1 className="question">{questions[currentQuestionIndex].question}</h1>
        <div className="options-container">
          {questions[currentQuestionIndex].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswerClick(option)} className="option-button">
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
