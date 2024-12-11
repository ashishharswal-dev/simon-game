import React, { useState, useEffect } from "react";
import "./App.css";

import redSound from "./sounds/red.mp3";
import yellowSound from "./sounds/yellow.mp3";
import blueSound from "./sounds/blue.mp3";
import greenSound from "./sounds/green.mp3";
import wrongSound from "./sounds/wrong.mp3";

const sounds = {
  green: new Audio(greenSound),
  red: new Audio(redSound),
  yellow: new Audio(yellowSound),
  blue: new Audio(blueSound),
  wrong: new Audio(wrongSound)
};

function App() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [title, setTitle] = useState("Press a Key to Start");

  const colors = ["green", "red", "yellow", "blue"];

  const startGame = () => {
    console.log("Starting game...");
    setSequence([]);
    setPlayerSequence([]);
    setIsPlaying(true);
    setLevel(1);
    setTitle("Level 1");
    addToSequence();
  };

  const addToSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence(prev => [...prev, newColor]);
  };

  const playSequence = async () => {
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const button = document.querySelector(`.${sequence[i]}`);
      button.classList.add("active");
      sounds[sequence[i]].play();
      await new Promise(resolve => setTimeout(resolve, 500));
      button.classList.remove("active");
    }
  };

  const handlePlayerClick = (color) => {
    if (!isPlaying) return;
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    sounds[color].play();

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setIsPlaying(false);
      setTitle("Game Over! Press Any Key to Restart");
      sounds.wrong.play();
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setPlayerSequence([]);
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setTitle(`Level ${nextLevel}`);
      setTimeout(() => {
        addToSequence();
      }, 1000);
    }
  };

  useEffect(() => {
    if (sequence.length > 0) {
      playSequence();
    }
  }, [sequence]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      console.log("Key pressed:", e.key); // Debugging output
      if (!isPlaying) {
        startGame();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying]); // Ensure dependencies are correctly listed

  return (
    <div className="app">
      <h1 className="title">{title}</h1>
      <div className="game-board">
        {colors.map((color) => (
          <div
            key={color}
            className={`button ${color}`}
            onClick={() => handlePlayerClick(color)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
