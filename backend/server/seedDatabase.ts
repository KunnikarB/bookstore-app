import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const books = [
  {
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    price: 32,
    stock: 60,
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=550&fit=crop',
  },
  {
    title: 'Star Wars',
    author: 'Jonathan Rinzler',
    price: 40,
    stock: 5,
    coverUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=550&fit=crop',
  },
  {
    title: 'Pippi Långstrump',
    author: 'Astrid Lindgren',
    price: 38,
    stock: 7,
    coverUrl: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=550&fit=crop',
  },
  {
    title: 'Pettson får julbesök',
    author: 'Sven Nordqvist',
    price: 28,
    stock: 8,
    coverUrl: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=550&fit=crop',
  },
  {
    title: 'The Godfather',
    author: 'Mark Seal',
    price: 30,
    stock: 90,
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=550&fit=crop',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 29,
    stock: 100,
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=550&fit=crop',
  },
];

export const seedDatabase = async (dbUrl: string) => {
  const client = new MongoClient(dbUrl);

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
      return `Database already seeded with ${count} books`;
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
    return `Successfully seeded ${result.insertedCount} books`;
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    await client.close();
    throw error;
  }
};
