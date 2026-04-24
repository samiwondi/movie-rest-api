const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'movies.json');

class MovieModel {
  static getAll() {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading movies:', error);
      return [];
    }
  }

  static getById(id) {
    const movies = this.getAll();
    return movies.find(movie => movie.id === parseInt(id));
  }

  static create(movieData) {
    const movies = this.getAll();
    
    const newId = movies.length > 0 
      ? Math.max(...movies.map(m => m.id)) + 1 
      : 1;
    
    const newMovie = {
      id: newId,
      ...movieData,
      rating: parseFloat(movieData.rating) || 0,
      year: parseInt(movieData.year) || new Date().getFullYear()
    };

    movies.push(newMovie);
    this.saveAll(movies);
    return newMovie;
  }

  static update(id, updatedData) {
    const movies = this.getAll();
    const index = movies.findIndex(movie => movie.id === parseInt(id));
    
    if (index === -1) {
      return null;
    }

    movies[index] = {
      ...movies[index],
      ...updatedData,
      id: movies[index].id,
      rating: updatedData.rating ? parseFloat(updatedData.rating) : movies[index].rating,
      year: updatedData.year ? parseInt(updatedData.year) : movies[index].year
    };

    this.saveAll(movies);
    return movies[index];
  }

  static delete(id) {
    const movies = this.getAll();
    const index = movies.findIndex(movie => movie.id === parseInt(id));
    
    if (index === -1) {
      return false;
    }

    movies.splice(index, 1);
    this.saveAll(movies);
    return true;
  }

  static saveAll(movies) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving movies:', error);
      throw new Error('Failed to save data');
    }
  }
}

module.exports = MovieModel;
