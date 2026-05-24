import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

function BirthdaySurprise() {
  const [celebrate, setCelebrate] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleBlowOut = () => {
    setCandlesLit(false);
    setCelebrate(true);
  };

  return (
    <section className="surprise">
      {celebrate && (
        <Confetti
          width={size.width}
          height={size.height}
          recycle={false}
          numberOfPieces={420}
        />
      )}
      <motion.div
        className="surprise__panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2>May 24 — Your big birthday bash</h2>
        <p>
          The final surprise is here. This celebration is for the girl who
          lights up every room, who makes every meal feel cozy, and who always
          gives love with both hands.
        </p>
        <div className="cake-scene">
          <motion.div
            className={`cake ${candlesLit ? "cake--lit" : "cake--out"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="cake__candles">
              {[1, 2, 3, 4].map((value) => (
                <span key={value} className="cake__candle" />
              ))}
            </div>
            <div className="cake__layers">
              <span />
              <span />
            </div>
          </motion.div>
          <button
            type="button"
            className="surprise__button"
            onClick={handleBlowOut}
          >
            {candlesLit ? "Blow the candles" : "Make a wish again"}
          </button>
        </div>

        <div className="surprise__reasons">
          <div className="surprise__reason">
            <strong>For her kindness</strong>
            Because your heart is the place where everyone feels safe and
            celebrated.
          </div>
          <div className="surprise__reason">
            <strong>For her energy</strong>
            Because you make every dance, meal, and sunset feel unforgettable.
          </div>
          <div className="surprise__reason">
            <strong>For her love</strong>
            Because being with you is the most beautiful gift I have ever
            received.
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default BirthdaySurprise;
