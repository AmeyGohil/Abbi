import { useMemo } from "react";
import { motion } from "framer-motion";
import FloatingHearts from "./components/FloatingHearts";
import DayCard from "./components/DayCard";
import BirthdaySurprise from "./components/BirthdaySurprise";
import type { DayEntry } from "./data/days";
import { days } from "./data/days";

const YEAR = 2026;
const MONTH = 4; // May (0-indexed)

type UnlockEntry = DayEntry & {
  unlocked: boolean;
  isToday: boolean;
};

const formatProgress = (value: number) =>
  `${Math.max(0, Math.min(100, value))}%`;

function LoveApp() {
  const imageModules = import.meta.glob("./assets/may*.png", {
    eager: true,
    as: "url",
  }) as Record<string, string>;

  const dayImageMap = useMemo<Record<number, string>>(() => {
    return Object.entries(imageModules).reduce(
      (map, [path, url]) => {
        const match = path.match(/may(\d+)\.png$/);
        if (match) {
          map[Number(match[1])] = url;
        }
        return map;
      },
      {} as Record<number, string>,
    );
  }, []);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const unlockStatus = useMemo<UnlockEntry[]>(
    () =>
      days.map((item) => ({
        ...item,
        image: dayImageMap[item.day] ?? `/assets/may${item.day}.png`,
        unlocked: true,
        isToday:
          today.getFullYear() === YEAR &&
          today.getMonth() === MONTH &&
          today.getDate() === item.day,
      })),
    [dayImageMap, today],
  );

  const unlockedDays = unlockStatus.filter((item) => item.unlocked).length;
  const progress = useMemo(
    () => Math.round((unlockedDays / days.length) * 100),
    [unlockedDays],
  );
  const nextRelease = unlockStatus.find((item) => !item.unlocked);

  return (
    <div className="love-app">
      <FloatingHearts />
      <main>
        <motion.section
          className="header"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="banner">May 6–24 · 19 love notes</span>
          <h1 className="title">For Abbi, with love</h1>
          <p className="subtitle">
            A sunrise of surprises, stories, and quiet reminders for the
            kindest, smartest, and most beautiful heart I know. Each day unlocks
            another note until the grand birthday bash on May 24.
          </p>
          <div className="hero-note">
            <p>
              Nineteen little cards, each one a promise — of laughter,
              gratitude, and a lifetime of moments with you.
            </p>
            <div className="hero-heart">
              Open each card when its day arrives ♥
            </div>
          </div>
        </motion.section>

        <motion.section
          className="overview"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          <div className="progress-row">
            <div className="progress-text">
              <span>
                {unlockedDays} of {days.length} surprises unlocked
              </span>
              <strong>{formatProgress(progress)}</strong>
            </div>
            <div className="progress-bar" aria-hidden="true">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="progress-row">
            <p>
              {nextRelease
                ? `Next surprise opens on May ${nextRelease.day}.`
                : "All surprises are ready — happy birthday!"}
            </p>
          </div>
        </motion.section>

        <motion.section
          className="cards-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
        >
          <div className="cards-section__intro">
            <h2 className="cards-section__title">Your love notes</h2>
            <p className="cards-section__subtitle">
              Each card holds a photo and a handwritten message — tap the cover
              to open it, like a real greeting card.
            </p>
          </div>
          <div className="calendar">
            {unlockStatus.map((entry) => (
              <DayCard
                key={entry.day}
                entry={entry}
                isUnlocked={entry.unlocked}
                isToday={entry.isToday}
              />
            ))}
          </div>
        </motion.section>

        {unlockStatus.some((item) => item.day === 24 && item.unlocked) && (
          <BirthdaySurprise />
        )}
      </main>
    </div>
  );
}

export default LoveApp;
