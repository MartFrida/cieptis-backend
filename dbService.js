import mongoose from 'mongoose';

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const KnowledgeSchema = new mongoose.Schema({
  question: String,
  answer: String,
  keywords: [String],
});

const Knowledge = mongoose.model('Knowledge', KnowledgeSchema);

// Простой поиск по ключевым словам
async function searchKnowledgeBase(query) {
  const regex = new RegExp(query, 'i');
  const result = await Knowledge.findOne({ question: regex });
  return result ? result.answer : null;
}

export default searchKnowledgeBase;
