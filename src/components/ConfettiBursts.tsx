import { useEffect } from "react";
import confetti from "canvas-confetti";


function randomBurst() {
  const x = Math.random();
  const y = Math.random();
  const count = 40 + Math.floor(Math.random() * 60);

  confetti({
    particleCount: count,
    startVelocity: 18 + Math.random() * 18,
    spread: 50 + Math.random() * 60,
    origin: { x, y },

    ticks: 180,
    gravity: 0.7,
    scalar: 0.85,
    zIndex: 9999,
  });
}

function ConfettiBursts() {
  useEffect(() => {
    // first burst immediately
    randomBurst();

    const schedule = () => {
      randomBurst();
      // next burst in 1.2–3 seconds
      const id = setTimeout(schedule, 1200 + Math.random() * 1800);
      return id;
    };

    const id = setTimeout(schedule, 1200 + Math.random() * 1800);
    return () => clearTimeout(id);
  }, []);

  return null;
}

export default ConfettiBursts;
