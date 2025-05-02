import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askGPT(query, lang) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: 'system',
        content: `Отвечай на языке: ${lang}`,
      },
      {
        role: 'user',
        content: query,
      },
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

export default askGPT;
