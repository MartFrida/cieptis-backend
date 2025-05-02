import express from 'express';
import bodyParser from 'body-parser';
import { franc } from 'franc';
import dotenv from 'dotenv';

import askGPT from './gptService.js';
import searchKnowledgeBase from './dbService.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
    try {
        const { query } = req.body;
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
