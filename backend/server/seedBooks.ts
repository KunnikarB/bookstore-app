import prisma from './prisma.js';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

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
  const client = new MongoClient(process.env.DATABASE_URL || '');

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('bookstore');
    const booksCollection = db.collection('Book');

    // Check if books already exist
    const count = await booksCollection.countDocuments();

    if (count > 0) {
      console.log(`📚 Database already has ${count} books. Skipping seed.`);
      await client.close();
      return;
    }

    // Insert books directly using MongoDB driver
    const booksWithDates = books.map((book) => ({
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await booksCollection.insertMany(booksWithDates);
    console.log(`📚 ${result.insertedCount} sample books inserted successfully!`);

    await client.close();
    console.log('🔌 MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    await client.close();
    process.exit(1);
  }
};

seedBooks();
