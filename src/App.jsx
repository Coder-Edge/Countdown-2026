import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './App.css';

function App() {
  // CIBLE : 1er Janvier 2026 à 00:00:00
  const targetDate = new Date('January 1, 2026 00:00:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isNewYear, setIsNewYear] = useState(false);

  // Calcul du temps restant
  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      total: difference
    };
  }

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        setIsNewYear(true);
        fireConfetti();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fonction Confettis
  const fireConfetti = () => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    <div className="container">
      {isNewYear ? (
        <div className="celebration">
          <h1>🎉 2026 🎉</h1>
          <p>HAPPY NEW YEAR!</p>
        </div>
      ) : (
        <div className="timer-box">
          <h2>EN ROUTE VERS 2026</h2>
          <div className="countdown">
            {/* HEURES */}
            <div className="time-unit">
              <span>{formatTime(timeLeft.hours)}</span>
              <label>HEURES</label>
            </div>
            
            <span className="separator">:</span>
            
            {/* MINUTES */}
            <div className="time-unit">
              <span>{formatTime(timeLeft.minutes)}</span>
              <label>MINUTES</label>
            </div>
            
            <span className="separator">:</span>
            
            {/* SECONDES */}
            <div className="time-unit">
              <span className="seconds">{formatTime(timeLeft.seconds)}</span>
              <label>SECONDES</label>
            </div>
          </div>
          <p className="loading-text">INITIALISATION DU PROTOCOLE 2026...</p>
        </div>
      )}
    </div>
  );
}

export default App;