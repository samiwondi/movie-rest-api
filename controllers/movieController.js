const MovieModel = require('../models/movieModel');

class MovieController {
  static getAll(req, res) {
    try {
      const movies = MovieModel.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        count: movies.length,
        data: movies
      }));
    } catch (error) {
      MovieController.sendError(res, 500, 'Error fetching movies');
    }
  }

  static getById(req, res, id) {
    try {
      const movie = MovieModel.getById(id);
      
      if (!movie) {
MovieController.sendError(res, 404, `Movie with id ${id} not found`);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: movie
      }));
    } catch (error) {
      MovieController.sendError(res, 500, 'Error fetching movie');
    }
  }

  static create(req, res, body) {
    try {
      const movieData = JSON.parse(body);
      
      if (!movieData.title || !movieData.director) {
        MovieController.sendError(res, 400, 'Title and director are required');
        return;
      }

      const newMovie = MovieModel.create(movieData);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: newMovie,
        message: 'Movie created successfully'
      }));
    } catch (error) {
      MovieController.sendError(res, 400, 'Invalid request body');
    }
  }

  static update(req, res, id, body) {
    try {
      const updateData = JSON.parse(body);
      const updatedMovie = MovieModel.update(id, updateData);
      
      if (!updatedMovie) {
        MovieController.sendError(res, 404, `Movie with id ${id} not found`);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: updatedMovie,
        message: 'Movie updated successfully'
      }));
    } catch (error) {
      MovieController.sendError(res, 400, 'Invalid request body');
    }
  }

  static delete(req, res, id) {
    try {
      const deleted = MovieModel.delete(id);
      
      if (!deleted) {
        MovieController.sendError(res, 404, `Movie with id ${id} not found`);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Movie deleted successfully'
      }));
    } catch (error) {
      MovieController.sendError(res, 500, 'Error deleting movie');
    }
  }

  static sendError(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: message
    }));
  }
}

module.exports = MovieController;
