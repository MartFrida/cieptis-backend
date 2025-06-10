import express from 'express';
import bodyParser from 'body-parser';
import { franc } from 'franc';
import dotenv from 'dotenv';
// import cors from 'cors';

import askGPT from './gptService.js';
import searchKnowledgeBase from './dbService.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const allowedOrigins = [
    'https://centroentrenadores.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://entrenador-personal.netlify.app'
];

// Обработка CORS с динамическим выбором origin
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Credentials', 'true');

        if (req.method === 'OPTIONS') {
            // Обработка preflight-запроса
            return res.sendStatus(200);
        }
    }
    next();
});

// Можно оставить cors без опций или закомментировать, так как мы делаем настройку вручную
// app.use(cors({ credentials: true }));

app.post('/ask', async (req, res) => {
    try {
        const { query, language } = req.body;
        console.log("Received query:", query);
        console.log("Detected language:", language);

        if (!query) return res.status(400).json({ error: 'No query provided' });

        // Определение языка
        const langCode = franc(query);
        const lang = langCode === 'und' ? 'unknown' : langCode;

        // Попытка найти ответ в базе знаний
        const localAnswer = await searchKnowledgeBase(query);
        if (localAnswer) {
            return res.json({ answer: localAnswer, source: 'local', language: lang });
        }

        // GPT-ответ
        const gptAnswer = await askGPT(query, lang);
        res.json({ answer: gptAnswer, source: 'gpt', language: lang });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));