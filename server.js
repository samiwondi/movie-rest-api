const http = require('http');
const MovieRoutes = require('./routes/movieRoutes');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  MovieRoutes.handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
