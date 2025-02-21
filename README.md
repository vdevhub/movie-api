# Movie API

- This API represents a server-side component of a movie application.
- It provides access to information about different movies, directors, and genres.
- Users can sign up, update their personal information, and create a list of their favorite movies.

Movie API is hosted on [Heroku](https://movies-myflix-api-84dbf8740f2d.herokuapp.com/documentation.html). 
It also has documentation built with [JSDoc](https://jsdoc.app/).

![MovieAPIJSDocs](https://github.com/user-attachments/assets/af448359-370f-4118-aff7-e25b9b455247)

## Key Features
- Return a list of ALL movies to the user.
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user.
- Return data about a genre (description) by name/title (e.g., “Thriller”).
- Return data about a director (bio, birth year, death year) by name.
- Allow new users to register.
- Allow users to update their user info (username, password, email, date of birth).
- Allow users to add a movie to their list of favorites.
- Allow users to remove a movie from their list of favorites.
- Allow existing users to deregister.

## Tech
- Node.js
- Express
- MongoDB
- Postman
- JSON
- Morgan
- UUID
- Body Parser
- Mongoose
- Passport
- JWT
- Bcrypt
- CORS
- Express Validator
- Heroku
- MongoDB Atlas

## Methods
- REST API development and testing
- Endpoint routing with HTTP requests
- Serving static files
- Logging with Morgan
- Defining models with Mongoose
- Authentication and authorization using basic HTTP authentication and JWT token
- Hashing user passwords
- Server input validation using Express Validator
- Setting up environmental variables to ensure the security of sensitive data
- Implementing CORS (Cross-Origin Resource Sharing)
- Deploying API on Heroku
- Deploying MongoDB on MongoDB Atlas

## Tools
To work with this project:
- Have [Node.js](https://nodejs.org/en/download/package-manager) installed.
- If you want to create your own [MongoDB](https://www.mongodb.com/), you'll have to register at MongoDB, create your project and database, and add its configuration to the index.js file.
