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
      .catch((err) => {res.status(400).send('Error: ' + err)});
});

app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title})
      .then((movie) => {res.status(200).json(movie)})
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

app.get('/movies/genre/:genreName', (req, res) => {
  Movies.find({ "Genre.Name": req.params.genreName})
      .then((movies) => {res.status(200).json(movies)})
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

app.get('/movies/director/:directorName', (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName})
      .then((movie) => {res.status(200).json(movie.Director)})
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// POST Requests
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then ((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => {res.status(201).json(user)})
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

app.post('/users/:id/:movieId', async (req, res) => {
  await Users.findOneAndUpdate({ _id: req.params.id }, {
    $push: { FavouriteMovies: req.params.movieId } 
   },
   { new: true })
   .then((updatedUser) => {
    res.json(updatedUser);
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
   });
});

// PUT Requests
app.put('/users/:id', async (req, res) => {
  await Users.findOneAndUpdate({ _id: req.params.id }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true })
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  })
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