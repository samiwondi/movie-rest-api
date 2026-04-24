const url = require('url');
const MovieController = require('../controllers/movieController');

class MovieRoutes {
  static handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Route: GET /api/movies
    if (path === '/api/movies' && method === 'GET') {
      MovieController.getAll(req, res);
    }
    // Route: GET /api/movies/:id
    else if (path.match(/^\/api\/movies\/(\d+)$/) && method === 'GET') {
      const id = path.split('/')[3];
      MovieController.getById(req, res, id);
    }
    // Route: POST /api/movies
    else if (path === '/api/movies' && method === 'POST') {
      MovieRoutes.getBody(req, (body) => {
        MovieController.create(req, res, body);
      });
    }
    // Route: PUT /api/movies/:id
    else if (path.match(/^\/api\/movies\/(\d+)$/) && method === 'PUT') {
      const id = path.split('/')[3];
      MovieRoutes.getBody(req, (body) => {
        MovieController.update(req, res, id, body);
      });
    }
    // Route: DELETE /api/movies/:id
    else if (path.match(/^\/api\/movies\/(\d+)$/) && method === 'DELETE') {
      const id = path.split('/')[3];
MovieController.delete(req, res, id);
    }
    // Home route
    else if (path === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>Movie Review API</h1>
        <p>Welcome to the Movie Review API</p>
        <h2>Available Endpoints:</h2>
        <ul>
          <li>Get all movies</li>
          <li>Get a single movie</li>
          <li>Create a new movie</li>
          <li>Update a movie</li>
          <li>Delete a movie</li>
        </ul>
      `);
    }
    // 404 - Route not found
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Route not found'
      }));
    }
  }

  static getBody(req, callback) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      callback(body);
    });
  }
}

module.exports = MovieRoutes;
