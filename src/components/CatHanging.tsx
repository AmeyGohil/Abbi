import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, animate } from "framer-motion";
import "../styles/cat-swinging.css";
import FloatingHearts from "./FloatingHearts";
import DogCorgi from "./DogCorgi";
import DogBowl from "./DogBowl";
import FinaleCard from "./FinaleCard";
import Confetti from "./Confetti";
import ConfettiBursts from "./ConfettiBursts";

const catSounds = [
  new URL("../assets/cat/dragon-studio-cat-meow-401729.mp3", import.meta.url).href,
  new URL("../assets/cat/dragon-studio-cat-purr-sfx-482870.mp3", import.meta.url).href,
  new URL("../assets/cat/dragon-studio-cute-cat-meow-472372.mp3", import.meta.url).href,
  new URL("../assets/cat/freesound_community-cat-89108.mp3", import.meta.url).href,
  new URL("../assets/cat/freesound_community-cat-meow-85175.mp3", import.meta.url).href,
  new URL("../assets/cat/sound_garage-cat-meow-7-fx-306186.mp3", import.meta.url).href,
];

const activeAudio: HTMLAudioElement[] = [];

function playRandomCatSound() {
  const src = catSounds[Math.floor(Math.random() * catSounds.length)];
  const audio = new Audio(src);
  activeAudio.push(audio);
  audio.play().catch(() => {});
  audio.addEventListener("ended", () => {
    const i = activeAudio.indexOf(audio);
    if (i !== -1) activeAudio.splice(i, 1);
  });
}

function stopAllSounds() {
  activeAudio.forEach((a) => { a.pause(); a.currentTime = 0; });
  activeAudio.length = 0;
}

const TARGET = new Date("2026-05-24T00:00:00").getTime();

function useCountdown() {
  const calc = useCallback(() => {
    const diff = Math.max(0, TARGET - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, done: diff === 0 };
  }, []);

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function Countdown() {
  const { h, m, s, done } = useCountdown();

  if (done) return (
    <div style={{
      position: "absolute",
      bottom: "5vh",
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      pointerEvents: "none",
      zIndex: 5,
    }}>
      <span style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1, userSelect: "none" }}>😝</span>
    </div>
  );

  return (
    <div style={{
      position: "absolute",
      bottom: "5vh",
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      pointerEvents: "none",
      zIndex: 5,
    }}>
      <div style={{
        fontFamily: "'Play', sans-serif",
        fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: "rgba(160,69,110,0.82)",
        textShadow: "0 2px 12px rgba(196,90,148,0.18)",
        whiteSpace: "nowrap",
        lineHeight: 1,
        userSelect: "none",
      }}>
        {`${pad(h)} : ${pad(m)} : ${pad(s)}`}
      </div>
    </div>
  );
}

function LegChain({ depth }: { depth: number }) {
  if (depth <= 0) return <div className="cat-paw" />;
  return <div className="cat-leg"><LegChain depth={depth - 1} /></div>;
}

function TailChain({ depth }: { depth: number }) {
  if (depth <= 0) return <div className="cat-tail -end" />;
  return <div className="cat-tail"><TailChain depth={depth - 1} /></div>;
}

const barkSrc = new URL("../assets/dog-woof.mp3", import.meta.url).href;
const happySongSrc = new URL("../assets/the_mountain-happy-birthday-508020.mp3", import.meta.url).href;

// woof patterns: each array = delays (ms) at which to fire a single woof within a burst
const WOOF_PATTERNS = [
  [0],                       // single woof
  [0],                       // single woof
  [0, 480],                  // woof woof
  [0, 420],                  // woof woof
  [0, 430, 860],             // woof woof woof
  [0, 500, 950],             // woof woof woof
  [0, 460, 1800],            // woof … woof
  [0, 1600, 2100],           // woof … woof woof
];

function Stage2() {
  const [isFed, setIsFed] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const dogRef = useRef<HTMLDivElement | null>(null);
  const pettedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const happySongRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isFed) return;
    const audio = new Audio(happySongSrc);
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(() => {});
    happySongRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      happySongRef.current = null;
    };
  }, [isFed]);

  const handlePet = () => {
    // play woof
    const audio = new Audio(barkSrc);
    audio.play().catch(() => {});
    // flash petted state for 1.5s to speed up hearts
    if (pettedTimerRef.current) clearTimeout(pettedTimerRef.current);
    setIsPetted(true);
    pettedTimerRef.current = setTimeout(() => setIsPetted(false), 1500);
  };
  const barkAudios = useRef<HTMLAudioElement[]>([]);
  const isFedRef = useRef(false);
  const scheduleRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stopAllBarks = () => {
    scheduleRef.current.forEach(clearTimeout);
    scheduleRef.current = [];
    barkAudios.current.forEach((a) => { a.pause(); a.currentTime = 0; });
    barkAudios.current = [];
  };

  const playSingleWoof = () => {
    if (isFedRef.current) return;
    const audio = new Audio(barkSrc);
    barkAudios.current.push(audio);
    audio.play().catch(() => {});
    audio.addEventListener("ended", () => {
      barkAudios.current = barkAudios.current.filter((a) => a !== audio);
    });
  };

  const scheduleNextBurst = () => {
    if (isFedRef.current) return;
    // pick a random pattern
    const pattern = WOOF_PATTERNS[Math.floor(Math.random() * WOOF_PATTERNS.length)];
    // fire each woof in the pattern
    pattern.forEach((delay) => {
      const t = setTimeout(() => playSingleWoof(), delay);
      scheduleRef.current.push(t);
    });
    // schedule the next burst: 5–11 seconds after the last woof in this pattern
    const lastWoof = pattern[pattern.length - 1];
    const gap = 2500 + Math.random() * 3500;
    const next = setTimeout(() => scheduleNextBurst(), lastWoof + gap);
    scheduleRef.current.push(next);
  };

  useEffect(() => {
    isFedRef.current = isFed;
    if (isFed) {
      stopAllBarks();
      return;
    }
    // kick off first burst after a short delay
    const init = setTimeout(() => scheduleNextBurst(), 800);
    scheduleRef.current.push(init);
    return () => stopAllBarks();
  }, [isFed]);

  return (
    <>
      {!isFed && (
        <div style={{
          position: "fixed",
          top: "4vh",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Play', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
          color: "rgba(160,69,110,0.85)",
          letterSpacing: "0.04em",
          pointerEvents: "none",
          zIndex: 10,
        }}>
          I am Hungry 🐶
        </div>
      )}
      <DogCorgi isFed={isFed} dogRef={dogRef} onPet={handlePet} isPetted={isPetted} />
      <DogBowl isFed={isFed} onFed={() => setIsFed(true)} dogRef={dogRef} />

      {isFed && <Confetti />}
      {isFed && <ConfettiBursts />}

      {isFed && createPortal(
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 50 }}>
          <FinaleCard />
        </div>,
        document.body
      )}
    </>
  );
}

function CatHanging() {
  // STAGES:
  // 1 = cat hanging (initial)
  // 2 = cat disappeared (after 8 clicks) — next stages TBD
  const [stage, setStage] = useState<1 | 2>(1); // start at cat hanging with countdown
  const catY = useMotionValue(0);
  const catOpacity = useMotionValue(1);
  const clickTimes = useRef<number[]>([]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const triggerEscape = () => {
    stopAllSounds();
    animate(catY, -window.innerHeight * 1.2, {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => setStage(2),
    });
    animate(catOpacity, 0, { duration: 0.5, delay: 0.3 });
  };

  const handleScreenClick = () => {
    if (stage !== 1) return;
    // before May 24 midnight, clicks only play cat sounds — no stage transition
    if (Date.now() < TARGET) {
      playRandomCatSound();
      return;
    }
    const now = Date.now();
    clickTimes.current.push(now);
    clickTimes.current = clickTimes.current.filter((t) => now - t <= 10000);
    if (clickTimes.current.length >= 8) {
      clickTimes.current = [];
      triggerEscape();
    } else {
      playRandomCatSound();
    }
  };

  return (
    <>
      {/* Stage 1: cat hanging — inside .cat-root so scoped CSS applies */}
      {stage !== 2 && (
        <div className="cat-root" onClick={handleScreenClick} style={{ cursor: "pointer" }}>
          <FloatingHearts />
          <Countdown />
          <motion.div style={{ y: catY, opacity: catOpacity }}>
            <div className="all-wrap">
              <div className="all">
                <div className="yarn" />
                <div className="cat-wrap">
                  <div className="cat">
                    <div className="cat-upper">
                      <div className="cat-leg" />
                      <div className="cat-leg" />
                      <div className="cat-head">
                        <div className="cat-ears">
                          <div className="cat-ear" />
                          <div className="cat-ear" />
                        </div>
                        <div className="cat-face">
                          <div className="cat-eyes" />
                          <div className="cat-mouth" />
                          <div className="cat-whiskers" />
                        </div>
                      </div>
                    </div>
                    <div className="cat-lower-wrap">
                      <div className="cat-lower">
                        <div className="cat-leg"><LegChain depth={15} /></div>
                        <div className="cat-leg"><LegChain depth={15} /></div>
                        <div className="cat-tail"><TailChain depth={14} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Stage 2: outside .cat-root so card CSS is never contaminated */}
      {stage === 2 && (
        <div style={{ position: "fixed", inset: 0, background: "radial-gradient(circle at top, #fff4fb 0%, #ffd7ee 35%, #ffe9f3 100%)" }}>
          <FloatingHearts />
          <Stage2 />
        </div>
      )}
    </>
  );
}

export default CatHanging;
