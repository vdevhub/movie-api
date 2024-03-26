const express = require('express'),
      morgan = require('morgan');
const app = express();

let users = [];

let topMovies = [
  {
    title: 'Pearl Harbor',
    year: '2001',
    director: {
      name: 'Michael Bay',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'Suite Française',
    year: '2014',
    director: {
      name: 'Saul Dibb',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'Crashpoint - 90 Minuten bis zum Absturz',
    year: '2009',
    director: {
      name: 'Thomas Jauch',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'Armageddon',
    year: '1998',
    director: {
      name: 'Michael Bay',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'Taken',
    year: '2008',
    director: {
      name: 'Pierre Morel',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'La bella e la bestia',
    year: '2014',
    director: {
      name: 'Fabrizio Costa',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'Ein Sommer in Griechenland',
    year: '2015',
    director: {
      name: 'Jorgo Papavassiliou',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'Schindler\'s List',
    year: '1993',
    director: {
      name: 'Steven Spielberg',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'Eat, Pray, Love',
    year: '2010',
    director: {
      name: 'Ryan Murphy',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  },
  {
    title: 'Ocean\'s Eleven',
    year: '2001',
    director: {
      name: 'Steven Soderbergh',
      bio: 'It is a director.'
    },
    genre:  {
      name: 'Drama',
      description: 'Some genre'
    }
  }
];

app.use(morgan('common'));
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movies list!');
});

app.get('/movies', (req, res) => {
  res.status(200).json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = topMovies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  }
  else {
    res.status(400).send('No such movie');
  }
});

app.get('/movies/genre/:genreName', (req, res) => {
  const genreName = req.params.genreName;
  const genre = topMovies.find(movie => movie.genre.name === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  }
  else {
    res.status(400).send('No such genre');
  }
});

app.get('/movies/director/:directorName', (req, res) => {
  const directorName = req.params.directorName;
  const director = topMovies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  }
  else {
    res.status(400).send('No such genre');
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