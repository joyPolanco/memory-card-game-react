import React, { useEffect, useState, useRef } from "react";
import useAppStore from "../store/useAppStore";
import { useNavigate } from "react-router-dom";

const Timer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime * 60);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const timerRef = useRef(null);
  const { setIsPlaying, setIsRunning, isRunning, isPlaying } = useAppStore();
  const navigate = useNavigate();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 60 && timeLeft > 0;

  useEffect(() => {
    if (!isRunning || isTimeOver) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimeOver(true);
          setIsPlaying(false);
          setIsRunning(false);
          if (onTimeUp) onTimeUp();
          setTimeout(() => navigate("/lobby"), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [isRunning, isTimeOver, setIsPlaying, setIsRunning, navigate, onTimeUp]);

  const handlePausePlay = () => {
    if (isTimeOver) return;
    setIsRunning(!isRunning);
  };

  const handleLobby = () => {
    setIsPlaying(false);
    setIsRunning(false);
    clearInterval(timerRef.current);
    navigate("/lobby");
  };

  return (
    <div className="timer-container">
      <div className="timer-content">
        <div className={`timer-display ${isWarning ? "warning" : ""} ${isTimeOver ? "timeover" : ""}`}>
          {isTimeOver ? (
            <div className="timeover-message">¡TIEMPO!</div>
          ) : (
            <div className="time-number">
              <span className="minutes">{minutes.toString().padStart(2, "0")}</span>
              <span className="separator">:</span>
              <span className="seconds">{seconds.toString().padStart(2, "0")}</span>
            </div>
          )}
        </div>
        <div className="timer-controls">
          <button 
            onClick={handlePausePlay} 
            className="control-btn" 
            disabled={isTimeOver}
          >
            {isRunning ? "⏸ Pausar" : "▶ Reanudar"}
          </button>
          <button onClick={handleLobby} className="control-btn exit">
            🚪 Terminar partida
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;