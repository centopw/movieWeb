import express from "express";
import Movie from "../models/movieModel.js";

const router = express.Router();

router.get('/discover/movie', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20; // You can adjust this value
    const skip = (page - 1) * limit;
    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);

    const movies = await Movie.find().skip(skip).limit(limit);

    res.json({
      page,
      results: movies,
      total_pages: totalPages,
      total_results: totalMovies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

export default router;
