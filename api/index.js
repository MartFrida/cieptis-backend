import express from 'express';
import { franc } from 'franc';
import dotenv from 'dotenv';
import askGPT from '../gptService.js';
import cors from 'cors';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'https://cieptis-backend.vercel.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

app.options('*', cors());

app.post('/ask', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: 'No query provided' });

        const langCode = franc(query);
        const lang = langCode === 'und' ? 'unknown' : langCode;

        const gptAnswer = await askGPT(query, lang);
        res.json({ answer: gptAnswer, source: 'gpt', language: lang });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 👇 Вот тут магия: экспортируем как serverless handler
export default serverless(app);
