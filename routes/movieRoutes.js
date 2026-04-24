const url = require('url');
const fs = require('fs');
const path = require('path');
const MovieController = require('../controllers/movieController');

class MovieRoutes {
  static handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    console.log(`${method} ${pathname}`);

    // API Routes
    if (pathname === '/api/movies' && method === 'GET') {
      MovieController.getAll(req, res);
    }
    else if (pathname.match(/^\/api\/movies\/(\d+)$/) && method === 'GET') {
      const id = pathname.split('/')[3];
      MovieController.getById(req, res, id);
    }
    else if (pathname === '/api/movies' && method === 'POST') {
      // FIXED: Better body parsing
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        console.log('Received chunk:', chunk.toString());
      });
      req.on('end', () => {
        console.log('Complete body:', body);
        if (!body || body.trim() === '') {
          console.log('Empty body received');
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Request body is empty'
          }));
          return;
        }
        MovieController.create(req, res, body);
      });
    }
    else if (pathname.match(/^\/api\/movies\/(\d+)$/) && method === 'PUT') {
      const id = pathname.split('/')[3];
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        MovieController.update(req, res, id, body);
      });
    }
    else if (pathname.match(/^\/api\/movies\/(\d+)$/) && method === 'DELETE') {
      const id = pathname.split('/')[3];
      MovieController.delete(req, res, id);
    }
    // Serve frontend
    else if (method === 'GET') {
      const frontendPath = path.join(__dirname, '../frontend.html');
      fs.readFile(frontendPath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>Movie API</title></head>
            <body>
              <h1>Movie Review API</h1>
              <p>Frontend not found. API is working!</p>
              <h2>Test API:</h2>
              <input type="text" id="title" placeholder="Title">
              <input type="text" id="author" placeholder="Author">
              <button onclick="testAPI()">Add Movie</button>
              <div id="result"></div>
              <script>
                async function testAPI() {
                  const title = document.getElementById('title').value;
                  const author = document.getElementById('author').value;
                  const response = await fetch('/api/movies', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({title: title, author: author})
                  });
                  const data = await response.json();
                  document.getElementById('result').innerHTML = JSON.stringify(data);
                  console.log(data);
                }
              </script>
            </body>
            </html>
          `);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Route not found'
      }));
    }
  }
}

module.exports = MovieRoutes;