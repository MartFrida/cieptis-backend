export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'No query provided' });
        }

        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Ты — виртуальный ассистент...' },
                    { role: 'user', content: query },
                ],
                temperature: 0.7,
            });

            return res.status(200).json({ answer: completion.choices[0].message.content });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'OpenAI error' });
        }
    }

    return res.status(405).end(); // method not allowed
}