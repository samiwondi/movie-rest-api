// controllers/movieController.js
let movies = [];
let nextId = 1;

// Initialize with 10 sample movies
function initializeMovies() {
    const sampleMovies = [
        {
            id: nextId++,
            title: "Inception",
            author: "Christopher Nolan",
            review: "A mind-bending masterpiece that explores dreams within dreams. The visuals are stunning and the plot keeps you guessing until the end.",
            rating: 9.0,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "The Shawshank Redemption",
            author: "Frank Darabont",
            review: "An incredible story of hope and friendship. One of the greatest films ever made.",
            rating: 9.3,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "The Dark Knight",
            author: "Christopher Nolan",
            review: "Heath Ledger's Joker is unforgettable. A dark, thrilling superhero film that transcends the genre.",
            rating: 9.0,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "Pulp Fiction",
            author: "Quentin Tarantino",
            review: "Iconic dialogue, non-linear storytelling, and unforgettable characters. A true classic.",
            rating: 8.9,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "Forrest Gump",
            author: "Robert Zemeckis",
            review: "A heartwarming journey through American history. Tom Hanks delivers an amazing performance.",
            rating: 8.8,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "The Matrix",
            author: "The Wachowskis",
            review: "Revolutionary visual effects and a thought-provoking story about reality and perception.",
            rating: 8.7,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "Goodfellas",
            author: "Martin Scorsese",
            review: "The ultimate gangster film. Brilliant direction, editing, and performances.",
            rating: 8.7,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "Fight Club",
            author: "David Fincher",
            review: "A dark, edgy, and thought-provoking film about consumerism and identity.",
            rating: 8.8,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "The Lord of the Rings: The Fellowship of the Ring",
            author: "Peter Jackson",
            review: "An epic adventure that brings Tolkien's world to life. Stunning visuals and storytelling.",
            rating: 8.8,
            createdAt: new Date().toISOString()
        },
        {
            id: nextId++,
            title: "Interstellar",
            author: "Christopher Nolan",
            review: "A beautiful and emotional journey through space and time. Hans Zimmer's score is incredible.",
            rating: 8.6,
            createdAt: new Date().toISOString()
        }
    ];
    
    movies = sampleMovies;
    console.log(`✅ Initialized with ${movies.length} sample movies`);
}

// Call initialization when server starts
initializeMovies();

class MovieController {
    static getAll(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: movies,
            count: movies.length
        }));
    }

    static getById(req, res, id) {
        const movie = movies.find(m => m.id === parseInt(id));
        if (movie) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: movie
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Movie not found'
            }));
        }
    }

    static create(req, res, body) {
        console.log('Creating movie with body:', body);
        
        try {
            const movieData = JSON.parse(body);
            
            if (!movieData.title || movieData.title.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Title is required'
                }));
                return;
            }
            
            if (!movieData.author || movieData.author.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Author is required'
                }));
                return;
            }
            
            const newMovie = {
                id: nextId++,
                title: movieData.title.trim(),
                author: movieData.author.trim(),
                review: movieData.review || '',
                rating: movieData.rating || null,
                createdAt: new Date().toISOString()
            };
            
            movies.push(newMovie);
            console.log('Movie added:', newMovie);
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: newMovie,
                message: 'Movie added successfully'
            }));
            
        } catch (error) {
            console.error('Parse error:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Invalid JSON format: ' + error.message
            }));
        }
    }

    static update(req, res, id, body) {
        try {
            const movieIndex = movies.findIndex(m => m.id === parseInt(id));
            if (movieIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Movie not found'
                }));
                return;
            }
            
            const updateData = JSON.parse(body);
            
            if (updateData.title) movies[movieIndex].title = updateData.title;
            if (updateData.author) movies[movieIndex].author = updateData.author;
            if (updateData.review !== undefined) movies[movieIndex].review = updateData.review;
            if (updateData.rating !== undefined) movies[movieIndex].rating = updateData.rating;
            
            movies[movieIndex].updatedAt = new Date().toISOString();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: movies[movieIndex],
                message: 'Movie updated successfully'
            }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Invalid JSON'
            }));
        }
    }

    static delete(req, res, id) {
        const movieIndex = movies.findIndex(m => m.id === parseInt(id));
        if (movieIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Movie not found'
            }));
            return;
        }
        
        const deletedMovie = movies.splice(movieIndex, 1)[0];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: deletedMovie,
            message: 'Movie deleted successfully'
        }));
    }
    
    // Optional: Reset to sample movies (useful for testing)
    static resetToSample(req, res) {
        initializeMovies();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'Reset to sample movies',
            data: movies
        }));
    }
}

module.exports = MovieController;