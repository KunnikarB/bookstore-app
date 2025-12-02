import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define schema directly here
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

// Avoid model overwrite error in watch mode
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

const books = [
  {
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    price: 32,
    stock: 60,
  },
  { title: 'Star Wars', author: 'Jonathan Rinzler', price: 40, stock: 5 },
  { title: 'Pippi Långstrump', author: 'Astrid Lindgren', price: 38, stock: 7 },
  {
    title: 'Pettson får julbesök',
    author: 'Sven Nordqvist',
    price: 28,
    stock: 8,
  },
  { title: 'The Godfather', author: 'Mark Seal', price: 30, stock: 90 },
  { title: 'Clean Code', author: 'Robert C. Martin', price: 29, stock: 100 },
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstore');
    console.log('✅ MongoDB connected');

    await Book.deleteMany({});
    console.log('🗑️  Existing books removed');

    await Book.insertMany(books);
    console.log('📚 Sample books inserted successfully!');

    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();
