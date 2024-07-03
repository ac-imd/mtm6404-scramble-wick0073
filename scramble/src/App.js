import React, { useState, useEffect } from 'react';
import './App.css';

function shuffle(src) {
  const copy = [...src];
  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === 'string') {
    return copy.join('');
  }

  return copy;
}

// Array of words
const words = [
  "apple", "tree", "banana"
  , "cherry", "date", "fig", "boy", "orange",
  "grape", "house", "kiwi", "lemon", "mango", "orange", "cat", "dog", "canada", "australia", "girl"
];

function ScrambleGame() {
  const [wordList, setWordList] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(3);
  const maxStrikes = 3;

  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem('scrambleGameState'));
    if (storedState) {
      setWordList(storedState.wordList);
      setCurrentWord(storedState.currentWord);
      setScrambledWord(storedState.scrambledWord);
      setPoints(storedState.points);
      setStrikes(storedState.strikes);
      setPasses(storedState.passes);
    } else {
      startNewGame();
    }
  }, []);

  useEffect(() => {
    if (currentWord) {
      setScrambledWord(shuffle(currentWord));
    }
  }, [currentWord]);

  useEffect(() => {
    const state = {
      wordList,
      currentWord,
      scrambledWord,
      points,
      strikes,
      passes
    };
    localStorage.setItem('scrambleGameState', JSON.stringify(state));
  }, [wordList, currentWord, scrambledWord, points, strikes, passes]);

  const startNewGame = () => {
    const shuffledWords = shuffle(words);
    setWordList(shuffledWords);
    const firstWord = shuffledWords[0];
    setCurrentWord(firstWord);
    setScrambledWord(shuffle(firstWord));
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setMessage('');
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      setMessage('Correct!');
      nextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage('Incorrect. Try again.');
      if (strikes + 1 >= maxStrikes) {
        endGame();
      }
    }
    setGuess('');
  };

  const nextWord = () => {
    const remainingWords = wordList.slice(1);
    if (remainingWords.length === 0) {
      endGame();
    } else {
      const newWord = remainingWords[0];
      setWordList(remainingWords);
      setCurrentWord(newWord);
      setScrambledWord(shuffle(newWord));
    }
  };

  const passWord = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      if (passes - 1 === 0) {
        endGame();
      } else {
        nextWord();
      }
    }
  };

  const endGame = () => {
    setMessage(`Game is over! You scored ${points} points.`);
  };

  const handlePlayAgain = () => {
    startNewGame();
  };

  useEffect(() => {

    if (wordList.length === 0) {
      startNewGame();
    }
  }, [wordList]);

  const isGameOver = passes === 0 || strikes >= maxStrikes || wordList.length === 0;

  return (
    <div className="game">
      <h1>Welcome to Scramble.</h1>
      <div className="scoreSection">
        <div className="scoreSectionLeft">
          <h1>{points}</h1>
          <p>Points</p>
        </div>
        <div className="scoreSectionRight">
          <h1>{strikes}</h1>
          <p>Strikes</p>
        </div>
      </div>

      {message && <p className="gameMessage">{message}</p>}

      <h1>{scrambledWord}</h1>

      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          autoFocus
          disabled={isGameOver}
        />
      </form>

      <button className="passes" onClick={passWord} disabled={isGameOver}>
        Pass ({passes} remaining)
      </button>

      {isGameOver && (
        <button onClick={handlePlayAgain}>Play Again</button>
      )}
    </div>
  );
}

export default ScrambleGame;
