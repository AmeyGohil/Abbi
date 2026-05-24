import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/finale-card.css";
import frontImg from "../assets/front.png";
import innerImg from "../assets/inner.png";
import signImg from "../assets/sign.png";

const TILT = (() => {
  const hash = Math.sin(24 * 12.9898 + 24 * 78.233) * 43758.5453;
  return (hash - Math.floor(hash)) * 12 - 6;
})();

const CLOSED_W = 220;
const OPEN_W = Math.round(CLOSED_W * 1.75);

function FinaleCard() {
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false); // controls CSS flip class

  const handleOpen = () => {
    setOpen(true);
    // let the width expand first, then flip
    setTimeout(() => setFlipped(true), 80);
  };

  const handleClose = () => {
    // flip closed first, then shrink
    setFlipped(false);
    setTimeout(() => setOpen(false), 820);
  };

  return (
    <>
      {/* slide wrapper — only moves the card on open, nothing else changes */}
      <div
        style={{
          transform: open ? "translateX(50%)" : "translateX(0)",
          transition: "transform 0.5s ease",
        }}
      >
        {/* entrance wrapper — just triggers the spring-in, no fixed children */}
        <motion.div
          initial={{ opacity: 0, scale: 0.55, rotate: TILT - 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          style={{ cursor: "pointer" }}
          onClick={!open ? handleOpen : undefined}
        >
          <div
            className={`fc-card ${flipped ? "fc-card--open" : ""}`}
            style={
              {
                width: open ? OPEN_W : CLOSED_W,
                transition: "width 0.5s ease",
                "--fc-tilt": `${TILT}deg`,
              } as React.CSSProperties
            }
          >
            <div className="fc-back">
              <img src={innerImg} alt="" />
            </div>

            <div
              className="fc-front"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <img
                src={frontImg}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>

            <div className="fc-container">
              <div className="fc-container__inside">
                <div className="fc-note">
                  {/* decorative watermark elements */}
                  <span className="fc-deco fc-deco--1">♥</span>
                  <span className="fc-deco fc-deco--2">✦</span>
                  <span className="fc-deco fc-deco--3">♥</span>
                  <span className="fc-deco fc-deco--4">✿</span>
                  <span className="fc-deco fc-deco--5">✦</span>
                  <div className="fc-message">
                    <p>My love,</p>
                    <p>
                      From the very first moment I saw your smile, I was amazed
                      by how joyful you were and how naturally you made everyone
                      around you feel comfortable. But the more time I spent
                      with you, the more I began to see the deeper magic in you.
                      You have this beautiful way of making every place feel
                      warm, safe, and homely. And somewhere along the way, when
                      I thought about it differently, I realized that these were
                      the qualities I had always dreamed of in the person I
                      would want to spend my life with.
                    </p>
                    <p>
                      Since then, time and time again, you have shown me even
                      more reasons to admire you and fall deeper for you. Your
                      strength, your smartness, your boldness, your curiosity,
                      your quick learning, your creativity, your poetic heart,
                      your cooking, and countless other little things about you
                      make me feel so lucky to have you in my life.
                    </p>
                    <p>
                      The more we are together, the more connected I feel to
                      you. Thank you for everything you are, everything you do,
                      and all the love and warmth you bring into my life. I will
                      always be grateful for you.
                    </p>
                    <p>
                      Wishing you the happiest birthday, my love. I hope this
                      year gives you as much happiness, comfort, and light as
                      you bring into my world every day.
                    </p>
                    <p className="fc-sign-off">
                      - With all my love
                      <br />
                      Yours Always,
                    </p>
                    <img
                      src={signImg}
                      alt="signature"
                      className="fc-signature"
                    />
                    <p className="fc-date">24/05/2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* portal: backdrop — lives at body level, no ancestor transforms */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="fc-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 49,
                background: "rgba(45,20,35,0.22)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                cursor: "pointer",
              }}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

export default FinaleCard;
