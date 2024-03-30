import { MongoClient } from 'mongodb';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read JSON data
const loadMovieData = () => {
  const jsonData = fs.readFileSync(path.join(__dirname, 'moviesData.json'), 'utf-8');
  return JSON.parse(jsonData).results;
};

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const database = client.db("test");
    const movies = database.collection("movies");

    const moviesToInsert = loadMovieData();

    const result = await movies.insertMany(moviesToInsert);
    console.log(`${result.insertedCount} movies were inserted`);
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
