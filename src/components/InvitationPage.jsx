import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Pusheen from "./Pusheen.jsx";

const burstHearts = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  angle: (360 / 18) * index + (index % 2) * 8,
  distance: 100 + (index % 4) * 27,
  size: 15 + (index % 3) * 4,
}));

export default function InvitationPage({ onAccepted }) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 176, y: 29 });
  const buttonArea = useRef(null);
  const transitionTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  const runAway = () => {
    const area = buttonArea.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const buttonWidth = 112;
    const buttonHeight = 49;
    const maxX = Math.max(0, rect.width - buttonWidth - 12);
    const maxY = Math.max(0, rect.height - buttonHeight - 4);
    let x = Math.round(Math.random() * maxX);
    let y = Math.round(Math.random() * maxY);
    if (Math.abs(x - noPosition.x) < 36)
      x = (x + Math.round(maxX / 2)) % Math.max(maxX, 1);
    if (Math.abs(y - noPosition.y) < 18)
      y = (y + Math.round(maxY / 2)) % Math.max(maxY, 1);
    setNoPosition({ x, y });
  };

  const accept = () => {
    if (isCelebrating) return;
    setIsCelebrating(true);
    transitionTimer.current = window.setTimeout(onAccepted, 830);
  };

  return (
    <div className="invitation-card card-glass">
      <Pusheen variant="eyes" className="peek-cat" />
      <Pusheen variant="cookie" className="cookie-cat" />
      <div className="card-glow" aria-hidden="true" />

      <motion.div
        className={`invitation-content ${isCelebrating ? "is-celebrating" : ""}`}
        animate={
          isCelebrating
            ? { scale: [1, 1.045, 1.02], rotate: [0, -0.8, 0.8, 0] }
            : {}
        }
        transition={{ duration: 0.68, ease: "easeInOut" }}
      >
        <motion.div
          className="hero-pusheen-wrap"
          animate={{ y: [0, -9, 0], rotate: [0, 1, 0, -1, 0] }}
          transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <Pusheen variant="heart" className="hero-pusheen" />
        </motion.div>
        <p className="eyebrow">маленьке запрошення для тебе</p>
        <h1>
          Сонічка, чи підеш ти зі мною на побачення? <span>🥺❤️</span>
        </h1>

        <div className="invitation-actions" ref={buttonArea}>
          <motion.button
            className="primary-button yes-button"
            type="button"
            onClick={accept}
            whileHover={{ scale: 1.055 }}
            whileTap={{ scale: 0.96 }}
            disabled={isCelebrating}
          >
            ТАК <span>❤️</span>
          </motion.button>
          <motion.button
            className="no-button"
            type="button"
            onMouseEnter={runAway}
            onPointerDown={(event) => {
              event.preventDefault();
              runAway();
            }}
            onClick={runAway}
            animate={{ left: noPosition.x, top: noPosition.y }}
            transition={{ type: "spring", stiffness: 370, damping: 20 }}
            aria-label="Ні, але ця кнопка сором'язливо тікає"
          >
            НІ 🙈
          </motion.button>
        </div>
        <p className="tiny-plea">Ну будь ласочкааа 🥺</p>
      </motion.div>

      {isCelebrating && (
        <div className="heart-burst" aria-hidden="true">
          {burstHearts.map((heart) => {
            const radians = (heart.angle * Math.PI) / 180;
            return (
              <motion.span
                key={heart.id}
                initial={{ opacity: 0, scale: 0.35, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.35, 1.15, 0.75],
                  x: Math.cos(radians) * heart.distance,
                  y: Math.sin(radians) * heart.distance,
                }}
                transition={{
                  duration: 0.76,
                  delay: heart.id * 0.014,
                  ease: "easeOut",
                }}
                style={{ fontSize: heart.size }}
              >
                {heart.id % 4 === 0 ? "✦" : "♥"}
              </motion.span>
            );
          })}
        </div>
      )}
    </div>
  );
}
