import { motion } from 'framer-motion';

const suggestedTimes = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

export default function TimePicker({ selectedTime, onSelect, disabled }) {
  return (
    <div className={`time-picker ${disabled ? 'is-disabled' : ''}`}>
      <div className="time-options">
        {suggestedTimes.map((time) => (
          <motion.button
            key={time}
            type="button"
            className={`time-button ${selectedTime === time ? 'is-selected' : ''}`}
            onClick={() => onSelect(time)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.06, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.94 } : {}}
          >
            {time}
          </motion.button>
        ))}
      </div>
      <label className="custom-time-label">
        <span>Або обери свій час</span>
        <input type="time" value={selectedTime ?? ''} onChange={(event) => onSelect(event.target.value)} disabled={disabled} aria-label="Інший час" />
      </label>
    </div>
  );
}
