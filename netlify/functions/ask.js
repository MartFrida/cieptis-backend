const { franc } = require('franc');
const askGPT = require('../../gptService.js');
const searchKnowledgeBase = require('../../dbService.js');

export default async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS' },
      body: 'Method Not Allowed'
    };
  }

  const body = JSON.parse(event.body);
  const query = body.query;

  if (!query) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'No query provided' })
    };
  }

  const langCode = franc(query);
  const lang = langCode === 'und' ? 'unknown' : langCode;

  const localAnswer = await searchKnowledgeBase(query);
  if (localAnswer) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ answer: localAnswer, source: 'local', language: lang })
    };
  }

  const gptAnswer = await askGPT(query, lang);
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ answer: gptAnswer, source: 'gpt', language: lang })
  };
};
