const express = require('express'),
      morgan = require('morgan');
const app = express();

let users = [];

let topMovies = [
  {
    title: 'Pearl Harbor',
    year: '2001',
    director: 'Michael Bay'
  },
  {
    title: 'Suite Française',
    year: '2014',
    director: 'Saul Dibb'
  },
  {
    title: 'Crashpoint - 90 Minuten bis zum Absturz',
    year: '2009',
    director: 'Thomas Jauch'
  },
  {
    title: 'Armageddon',
    year: '1998',
    director: 'Michael Bay'
  },
  {
    title: 'Taken',
    year: '2008',
    director: 'Pierre Morel'
  },
  {
    title: 'La bella e la bestia',
    year: '2014',
    director: 'Fabrizio Costa'
  },
  {
    title: 'Ein Sommer in Griechenland',
    year: '2015',
    director: 'Jorgo Papavassiliou'
  },
  {
    title: 'Schindler\'s List',
    year: '1993',
    director: 'Steven Spielberg'
  },
  {
    title: 'Eat, Pray, Love',
    year: '2010',
    director: 'Ryan Murphy'
  },
  {
    title: 'Ocean\'s Eleven',
    year: '2001',
    director: 'Steven Soderbergh'
  }
];

app.use(morgan('common'));
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movies list!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error occurred!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});