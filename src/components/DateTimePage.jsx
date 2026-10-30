import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar.jsx";
import TimePicker from "./TimePicker.jsx";

const capitalize = (text) =>
  text ? text.charAt(0).toLocaleUpperCase("uk-UA") + text.slice(1) : "";

export const formatSelection = (date, time, options = {}) => {
  if (!date || !time) return "";
  const formatted = new Intl.DateTimeFormat("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...options,
  }).format(date);
  return `${capitalize(formatted)}, о ${time}`;
};

export default function DateTimePage({
  selection,
  onSelectionChange,
  onConfirm,
}) {
  const [dateFlash, setDateFlash] = useState(false);
  const [timeFlash, setTimeFlash] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const flashTimers = useRef([]);

  useEffect(() => () => flashTimers.current.forEach(window.clearTimeout), []);
  const flash = (kind) => {
    const setter = kind === "date" ? setDateFlash : setTimeFlash;
    setter(true);
    const timer = window.setTimeout(() => setter(false), 650);
    flashTimers.current.push(timer);
  };
  const chooseDate = (date) => {
    onSelectionChange({ ...selection, date });
    flash("date");
  };
  const chooseTime = (time) => {
    if (!selection.date || !time) return;
    onSelectionChange({ ...selection, time });
    flash("time");
  };
  const ready = Boolean(selection.date && selection.time);
  const summary = formatSelection(selection.date, selection.time);
  const confirm = () => {
    if (!ready || isConfirming) return;
    setIsConfirming(true);
    onConfirm();
  };

  return (
    <div className="date-card card-glass">
      <div className="section-heading">
        <span className="little-heart">♡</span>
        <h1>
          Урааа! <span>❤️</span> Я дуже радий!
        </h1>
        <p>Тоді давай оберемо день нашої зустрічі 🥰</p>
      </div>

      <div className="date-time-layout">
        <div className="calendar-side effect-zone">
          <p className="field-label">Спочатку обери день</p>
          <Calendar selectedDate={selection.date} onSelect={chooseDate} />
          {dateFlash && <SelectionBurst variant="date" />}
        </div>

        <AnimatePresence initial={false}>
          {selection.date && (
            <motion.div
              className="time-side effect-zone"
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="field-label">
                А о котрій годинці зустрінемось? <span>⏲︎</span>
              </p>
              <TimePicker
                selectedTime={selection.time}
                onSelect={chooseTime}
                disabled={!selection.date}
              />
              {timeFlash && <SelectionBurst variant="time" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className={`selection-summary ${ready ? "is-ready" : ""}`}
        animate={ready ? { scale: [1, 1.018, 1] } : {}}
      >
        {ready ? (
          <>
            Значить, <strong>{summary}</strong> <span>♡</span>
          </>
        ) : (
          "Я чекатиму на твій вибір ♡"
        )}
      </motion.div>
      <motion.button
        className="primary-button confirm-button"
        type="button"
        disabled={!ready || isConfirming}
        onClick={confirm}
        whileHover={ready && !isConfirming ? { scale: 1.035 } : {}}
        whileTap={ready && !isConfirming ? { scale: 0.97 } : {}}
      >
        ПІДТВЕРДИТИ <span>❤️</span>
      </motion.button>
    </div>
  );
}

function SelectionBurst({ variant }) {
  return (
    <div className={`selection-burst ${variant}`} aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 9;
        const distance = 36 + (index % 3) * 16;
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.2, 1, 0.5],
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
            }}
            transition={{ duration: 0.58, delay: index * 0.02 }}
          >
            {index % 3 === 0 ? "♥" : "✦"}
          </motion.span>
        );
      })}
    </div>
  );
}
