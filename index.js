//Import required modules
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

//Define constants for Express, models, and input validation
const app = express();
const Movies = Models.Movie;
const Users = Models.User;

const { check, validationResult } = require('express-validator');

//Connect to MongoDB
//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Define usage of logging, static files, and request parsing
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Define CORS
const cors = require('cors');
let allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:4200',
  'https://myflix-vdevhub.netlify.app',
  'https://vdevhub.github.io',
  'https://github.com'];
// app.use(cors());
app.use('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

//Import requires authentication and authorization modules
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// GET requests

// Get API root
app.get('/', (req, res) => {
  res.send('Welcome to myFlix API!');
});

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => { res.status(200).json(movies) })
    .catch((err) => { res.status(400).send('Error: ' + err) });
});

// Get movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => { res.status(200).json(movie) })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get genre by genre name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => { res.status(200).json(movie.Genre) })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get director by director name
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => { res.status(200).json(movie.Director) })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// POST Requests

// Create new user
app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required and must have at least 10 characters').isLength({ min: 10 }),
  check('Email', 'Email does not appear to be valid').isEmail(),
  check('Birthday', 'Birthday is not a valid date').optional().isDate({ format: 'yyyy-mm-dd' })
], async (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then((user) => { res.status(201).json(user) })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          })
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Add new favourite movie to user's list
app.post('/users/:id/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ _id: req.params.id }, {
    $push: { FavouriteMovies: req.params.movieId }
  },
    { new: true })
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// PUT Requests

// Update user's details
app.put('/users/:id', [
  check('id', 'User id is required').notEmpty(),
  check('Username', 'Username is required').optional().isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').optional().isAlphanumeric(),
  check('Password', 'Password must have at least 10 characters').optional().isLength({ min: 10 }),
  check('Email', 'Email does not appear to be valid').optional().isEmail(),
  check('Birthday', 'Birthday is not a valid date').optional().isDate({ format: 'yyyy-mm-dd' })
], passport.authenticate('jwt', { session: false }), async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.user.id !== req.params.id) {
    return res.status(400).send('Permission denied');
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  await Users.findOneAndUpdate({ _id: req.params.id }, {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true })
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// DELETE Requests

// Remove movie from user's favourite movies list
app.delete('/users/:id/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ _id: req.params.id }, {
    $pull: { FavouriteMovies: req.params.movieId }
  },
    { new: true })
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Delete user
app.delete('/users/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(400).send('User with id ' + req.params.id + ' was not found');
      } else {
        res.status(200).send('User with id ' + req.params.id + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// General error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error occurred!');
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});