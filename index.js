const express = require('express'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      Models = require('./models.js');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix API!');
});

app.get('/movies', (req, res) => {
  Movies.find()
      .then((movies) => {res.status(200).json(movies)})
      .catch((err) => {res.status(400).send('Resource not found: ' + err)});
});

app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  }
  else {
    res.status(400).send('No such movie');
  }
});

app.get('/movies/genre/:genreName', (req, res) => {
  const genreName = req.params.genreName;
  const genre = movies.find(movie => movie.genre.name === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  }
  else {
    res.status(400).send('No such genre');
  }
});

app.get('/movies/director/:directorName', (req, res) => {
  const directorName = req.params.directorName;
  const director = movies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  }
  else {
    res.status(400).send('No such genre');
  }
});

// POST Requests
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } 
  else {
    res.status(400).send('Users need names!');
  }
});

app.post('/users/:id/:movieTitle', (req, res) => {
  const id =  req.params.id;
  const movieTitle =  req.params.movieTitle;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  }
  else {
    res.status(400).send('No such user');
  }
});

// PUT Requests
app.put('/users/:id', (req, res) => {
  const id =  req.params.id;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  }
  else {
    res.status(400).send('No such user');
  }
});

// DELETE Requests
app.delete('/users/:id/:movieTitle', (req, res) => {
  const id =  req.params.id;
  const movieTitle =  req.params.movieTitle;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  }
  else {
    res.status(400).send('No such user');
  }
});

app.delete('/users/:id', (req, res) => {
  const id =  req.params.id;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id !== id);
    res.status(200).send(`User ${id} has been deleted.`);
  }
  else {
    res.status(400).send('No such user');
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error occurred!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});