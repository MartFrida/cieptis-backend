import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { franc } from 'franc';
import askGPT from '../gptService.js';

const app = express();

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'https://cieptis-backend.vercel.app', 'https://cieptis-frontend.vercel.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

app.options('*', (req, res) => {
    res.sendStatus(200);
});

app.post('/', async (req, res) => {
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

export default serverless(app);