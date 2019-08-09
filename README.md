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

## TODOs
* Submit Vote
* Submit Quest
* robustness when player leaves during a game

## API Documentation

* Games
  * Create Game - POST /api/games
    * Request Body: none
    * Response Body: `<Game Object>`
  * Get Games - GET /api/games
    * Request Body: none
    * Response Body: MongoDBPaginated([`<Game Object>`])
  * Get Game - GET /api/games/{game_id}
    * Request Body: none
    * Response Body: `<Game Object>`
  * Update Game - PUT /api/games/{game_id}
    * Request Body:
    ```
    {
        <game attribute key>: <game attribute val>
    }
    ```
  * Delete Game - DELETE /api/games/{game_id}
    * Request Body: none
    * Response Body: none
* Players
  * Create Player - POST /api/games/{game_id}/players
    * Request Body: none
    * Response Body: `<Player Object>`
  * Get Players - GET /api/games/{game_id}/players
    * Request Body: none
    * Response Body: [`<Player Object>`]
  * Get Player - GET /api/games/{game_id}/players/{player_id}
    * Request Body: none
    * Response Body: `<Player Object>`
  * Update Player - PUT /api/games/{game_id}/players/{player_id}
    * Request Body:
    ```
    {
        <game attribute key>: <game attribute val>
    }
    ```
  * Delete Player - DELETE /api/games/{game_id}/players/{player_id}
    * Request Body: none
    * Response Body: none
* Game Actions
  * Start Game - POST /api/games/{game_id}/players/{player_id}/gameActions/startGame
    * Request Body: none
    * Response Body: `<Game Object>`
  * End Game - POST /api/games/{game_id}/players/{player_id}/gameActions/endGame
    * Request Body: none
    * Response Body: `<Game Object>`
  * Submit Selection - POST /api/games/{game_id}/players/{player_id}/gameActions/submitSelection
    * Request Body: 
    ```
    {
        "selection": [<Player Id>]
    }
    ```
    * Response Body: `<Game Object>`
  * Submit Vote - POST /api/games/{game_id}/players/{player_id}/gameActions/submitVote
    * Request Body: 
    ```
    {
        "vote": <Boolean>
    }
    ```
    * Response Body: `<Game Object>`
  * Submit Quest - POST /api/games/{game_id}/players/{player_id}/gameActions/submitQuest
    * Request Body: 
    ```
    {
        "quest": <Boolean>
    }
    ```
    * Response Body: `<Game Object>`

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

**Setup Phase**
* Player submits setup
  * Submit Setup

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