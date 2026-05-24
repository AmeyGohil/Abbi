import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { DayEntry } from "../data/days";

type Props = {
  entry: DayEntry;
  isUnlocked: boolean;
  isToday: boolean;
};

const DEFAULT_PAGE = { w: 1122, h: 1402 };
const OPEN_SCALE = 1.75;
const FLY_MS = 500;
const FLIP_MS = 800;

function getCardTilt(day: number): number {
  const hash = Math.sin(day * 12.9898 + day * 78.233) * 43758.5453;
  const unit = hash - Math.floor(hash);
  return unit * 12 - 6;
}

function DayCard({ entry, isUnlocked, isToday }: Props) {
  const outerWrapRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE);
  const [open, setOpen] = useState(false);
  const [atCenter, setAtCenter] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const aspectRatio = `${pageSize.w} / ${pageSize.h}`;

  useEffect(() => {
    if (!entry.image) return;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setPageSize({ w: img.naturalWidth, h: img.naturalHeight });
      }
    };
    img.src = entry.image;
  }, [entry.image]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      setPageSize({ w: naturalWidth, h: naturalHeight });
    }
  };

  const clearCloseTimers = () => {
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    if (flyTimerRef.current) clearTimeout(flyTimerRef.current);
    flipTimerRef.current = null;
    flyTimerRef.current = null;
  };

  const closeCard = () => {
    if (!open || isClosing) return;

    setIsClosing(true);
    clearCloseTimers();

    flipTimerRef.current = setTimeout(() => {
      setAtCenter(false);
      flyTimerRef.current = setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
        flyTimerRef.current = null;
      }, FLY_MS);
      flipTimerRef.current = null;
    }, FLIP_MS);
  };

  useEffect(() => {
    return () => clearCloseTimers();
  }, []);

  const openCard = () => {
    const el = slotRef.current;
    if (!el) return;

    const cardEl = el.querySelector<HTMLElement>(".card");
    const rect = (cardEl ?? el).getBoundingClientRect();

    el.style.setProperty("--fly-top", `${rect.top}px`);
    el.style.setProperty("--fly-left", `${rect.left}px`);
    el.style.setProperty("--fly-width", `${rect.width}px`);
    const openWidth = rect.width * OPEN_SCALE;
    const openHeight = rect.height * OPEN_SCALE;

    el.style.setProperty("--fly-open-width", `${openWidth}px`);
    el.style.setProperty(
      "--fly-center-left",
      `${window.innerWidth / 2 - rect.width / 2}px`,
    );
    el.style.setProperty(
      "--fly-center-top",
      `${window.innerHeight / 2 - openHeight / 2}px`,
    );

    setAtCenter(false);
    setOpen(true);
  };

  const handleCardClick = () => {
    if (!isUnlocked || open || isClosing) return;
    openCard();
  };

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setAtCenter(true));
    const outerWrap = outerWrapRef.current;
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === outerWrap) closeCard();
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCard();
    };
    outerWrap?.addEventListener("click", onBackdropClick);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      cancelAnimationFrame(frame);
      outerWrap?.removeEventListener("click", onBackdropClick);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) closeCard();
      else openCard();
    }
  };

  return (
    <motion.div
      ref={outerWrapRef}
      className={`greeting-card-slot-wrap ${open ? "greeting-card-slot-wrap--open" : ""} ${isClosing ? "greeting-card-slot-wrap--closing" : ""}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.38, ease: "easeOut" }}
    >
      <div
        ref={slotRef}
        className={`greeting-card-slot ${open ? "greeting-card-slot--centered" : ""} ${atCenter ? "greeting-card-slot--at-center" : ""}`}
        style={
          {
            "--card-tilt": `${getCardTilt(entry.day)}deg`,
            aspectRatio,
          } as React.CSSProperties
        }
      >
        <div
          className={`card ${open && !isClosing ? "card--open" : ""} ${!isUnlocked ? "card--locked" : ""} ${isToday ? "card--today" : ""}`}
          role="button"
          tabIndex={isUnlocked ? 0 : -1}
          aria-expanded={open}
          aria-label={
            isUnlocked
              ? `${open ? "Close" : "Open"} love note for May ${entry.day}: ${entry.title}`
              : `Locked until May ${entry.day}`
          }
          onClick={handleCardClick}
          onKeyDown={handleKeyDown}
        >
          <div className="back" aria-hidden="true">
            {entry.image ? (
              <img src={entry.image} alt="" onLoad={handleImageLoad} />
            ) : null}
          </div>

          <div className="front">
            {isToday && <span className="card__ribbon">Today</span>}
            {entry.badge && !isToday && (
              <span className="card__ribbon">{entry.badge}</span>
            )}
            <span className="card__cover-date">May {entry.day}</span>
            <span className="card__heart" aria-hidden="true">
              ♥
            </span>
          </div>

          <div className="container">
            <div className="container__inside">
              <div className="container__note">
                <p className="container__message">{entry.message}</p>
              </div>
            </div>
          </div>

          {!isUnlocked && (
            <div className="card__lock">
              <span className="card__lock-icon" aria-hidden="true" />
              <p>Unlocks on May {entry.day}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default DayCard;
