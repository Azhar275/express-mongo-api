const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json()); // For parsing application/json

// MongoDB connection URI and database/collection details
const uri = '';
const client = new MongoClient(uri);

let moviesCollection;

// Connect to MongoDB and initialize the collection
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('sample_mflix'); // Database name
        moviesCollection = db.collection('movies'); // Collection name
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
}

connectToDatabase();

// Routes

// Get all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await moviesCollection.find({}).limit(10).toArray(); // Limiting to 10 results
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch movies', error: err.message });
    }
});

// Get a movie by ID
app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await moviesCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch movie', error: err.message });
    }
});

// Add a new movie
app.post('/movies', async (req, res) => {
    try {
        const newMovie = req.body;
        const result = await moviesCollection.insertOne(newMovie);
        res.status(201).json({ message: 'Movie added', movieId: result.insertedId });
    } catch (err) {
        res.status(400).json({ message: 'Failed to add movie', error: err.message });
    }
});

// Update a movie by ID
app.put('/movies/:id', async (req, res) => {
    try {
        const updateResult = await moviesCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (updateResult.matchedCount === 0) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json({ message: 'Movie updated' });
    } catch (err) {
        res.status(400).json({ message: 'Failed to update movie', error: err.message });
    }
});

// Delete a movie by ID
app.delete('/movies/:id', async (req, res) => {
    try {
        const deleteResult = await moviesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (deleteResult.deletedCount === 0) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json({ message: 'Movie deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete movie', error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
