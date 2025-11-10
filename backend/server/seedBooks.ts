import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.ts';

dotenv.config();

const books = [
  {
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    price: 32,
    stock: 6,
  },
  { title: 'Star Wars', author: 'Jonathan Rinzler', price: 40, stock: 5 },
  { title: 'Pippi Långstrump', author: 'Astrid Lindgren', price: 38, stock: 7 },
  {
    title: 'Pettson får julbesök',
    author: 'Sven Nordqvist',
    price: 28,
    stock: 8,
  },
  { title: 'The Godfather', author: 'Mark Seal', price: 30, stock: 9 },
];

const seedBooks = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore'
    );
    console.log('MongoDB connected');

    await Book.deleteMany({});
    console.log('Existing books removed');

    await Book.insertMany(books);
    console.log('Sample books inserted');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding books:', error);
  }
};

seedBooks();
