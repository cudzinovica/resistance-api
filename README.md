# resistance-api
API for the resistance made with NodeJS, ExpressJS and MongoDB. Has CRUD functionality for interacting with game and player objects.


## Database Setup

Download and install MogoDB.
Make sure that the database is running at `127.0.0.1:27017`


## Project Setup

Now run `cd todo-api` to go inside the directory

Run `npm install` to install all the dependencies.

Run `npm install -g nodemon` to install Nodemon Globally.

Run `npm start` to run the NodeJS Server.

## Functionality

* CRUD Games
* CRUD Players
* Start Game
* End Game

## Play flow

**Player in Home Page**
* Player Creates Game
  * Create Game
  * Create Player
* OR Player Joins Game
  * Create Player

**Player In Lobby**
* Player leaves game
  * Delete Player
* Player changes name
  * Update Player
* Player starts game
  * Start Game

**Player in Game**
* Player end game
  * End Game

**Selection Phase**
* Leader selects team
  * Submit Selection

**Vote Phase**
* Player submits vote
  * Submit Vote

**Quest Phase**
* Player submits quest card
  * Submit Quest

**Assassin Phase**
* Assassin chooses player
  * Submit Assassin