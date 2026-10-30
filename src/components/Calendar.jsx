import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const atMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function Calendar({ selectedDate, onSelect }) {
  const today = useMemo(() => atMidnight(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const previousDisabled = year === today.getFullYear() && month === today.getMonth();
  const monthLabel = new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' }).format(visibleMonth);

  const changeMonth = (direction) => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  const chooseDay = (day) => {
    const next = new Date(year, month, day);
    if (next < today) return;
    onSelect(next);
  };

  return (
    <section className="calendar" aria-label="Оберіть дату зустрічі">
      <div className="calendar-header">
        <button className="round-icon-button" type="button" onClick={() => changeMonth(-1)} disabled={previousDisabled} aria-label="Попередній місяць">‹</button>
        <h3>{monthLabel}</h3>
        <button className="round-icon-button" type="button" onClick={() => changeMonth(1)} aria-label="Наступний місяць">›</button>
      </div>
      <div className="calendar-grid weekday-row">
        {weekdays.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-grid day-grid">
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;
          const date = new Date(year, month, day);
          const isPast = date < today;
          const isToday = sameDay(date, today);
          const isSelected = sameDay(date, selectedDate);
          return (
            <motion.button
              key={day}
              type="button"
              className={`day-button ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
              disabled={isPast}
              onClick={() => chooseDay(day)}
              whileHover={!isPast ? { scale: 1.1 } : {}}
              whileTap={!isPast ? { scale: 0.9 } : {}}
              aria-pressed={isSelected}
              aria-label={`${day} ${monthLabel}`}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
