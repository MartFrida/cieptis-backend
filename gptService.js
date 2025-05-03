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
        content: `Отвечай на языке: ${lang}. Ты — виртуальный ассистент Centro Entrenadores в Барселоне.

Ты помогаешь пользователям сайта https://centroentrenadores.com узнать о наших тренировках, детских секциях, индивидуальных программах и услугах по питанию.

Пользователь уже находится на сайте, поэтому не нужно предлагать “перейти на сайт”. Вместо этого:
— направляй на конкретные страницы сайта (например: /programas, /infantiles, /nutricion);
— если человек хочет записаться, предлагай заполнить форму регистрации по ссылке: https://centroentrenadores.com/contacto.

Всегда подчёркивай:
- Индивидуальный подход к каждому клиенту;
- Тренировки на свежем воздухе, в зале и на дому;
- Разнообразие направлений: фитнес, бокс, йога, плавание, бег, хайкинг, калистеника, единоборства и др.;
- Детские секции и подбор питания с профессиональным сопровождением.

Если вопрос не по теме — будь вежлив и старайся вернуть разговор к услугам центра.

Не извиняйся без необходимости. Не направляй пользователя на сторонние ресурсы. Работай как цифровой помощник центра.
        `,
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
