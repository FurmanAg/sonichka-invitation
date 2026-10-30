import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { Resend } from 'resend';

const app = express();
const port = Number(process.env.PORT || 8787);
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '10kb' }));

function parseLocalDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) return null;
  return parsed;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

app.get('/api/health', (_request, response) => response.json({ ok: true }));

app.post('/api/invitations', async (request, response) => {
  const { date, time } = request.body ?? {};
  const selectedDate = parseLocalDate(date);
  if (!selectedDate || selectedDate < startOfToday()) {
    return response.status(400).json({ error: 'Будь ласка, оберіть коректну дату — не в минулому.' });
  }
  if (typeof time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return response.status(400).json({ error: 'Будь ласка, оберіть коректний час.' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_TO || !process.env.EMAIL_FROM) {
    return response.status(503).json({ error: 'Пошта ще не налаштована. Додайте дані Resend у файл .env.' });
  }

  const weekday = new Intl.DateTimeFormat('uk-UA', { weekday: 'long' }).format(selectedDate);
  const dateLabel = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' }).format(selectedDate);
  const text = `Твоя дівчина обрала дату та час зустрічі!\n\nДень: ${weekday}\nДата: ${dateLabel}\nЧас: ${time}\n\nТвоя Сонічка погодилась на зустріч! ❤️\n\nТепер ти знаєш, коли чекати на свою зустріч.\n\nЗ любов'ю, твоя інтерактивна листівочка 💌`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [process.env.EMAIL_TO],
      subject: '❤️ Сонічка погодилась на зустріч!',
      text,
    }, {
      // Resend safely de-duplicates an interrupted/repeated request for this same choice.
      idempotencyKey: `sonichka-meeting/${date}/${time}`,
    });
    if (error) {
      console.error('Resend rejected the email:', error);
      return response.status(502).json({ error: 'Resend не зміг надіслати лист. Перевірте адресу відправника та ключ.' });
    }
    return response.status(201).json({ ok: true, id: data?.id });
  } catch (error) {
    console.error('Email delivery failed:', error);
    return response.status(502).json({ error: 'Не вдалося надіслати лист. Перевірте налаштування Resend.' });
  }
});

// Не повертаємо HTML-сторінку Express, якщо клієнт випадково передав некоректний JSON.
app.use((error, _request, response, next) => {
  if (error?.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Сервер не зміг прочитати дані листівочки.' });
  }
  return next(error);
});

app.listen(port, () => console.log(`Invitation API is listening on http://localhost:${port}`));
