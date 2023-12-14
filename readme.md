# Word Chain, a CS-326 Final Project

## Summary and Usage

This project is a web application that allows users to play a game similar to word search. The user is presented with a grid of letters and a word bank. The user must find words in the word bank by selecting letters in the grid to form the words. Letters can be selected in any direction (up, down, left, right, and diagonally) as long as the letter selected is adjacent to the previously selected letter. Letters can also be deselected if it is a mistake by clicking on the last letter or using the clear button to remove all letters selected. Letters can be re-used even if they are already used to for other words that have been found in the word bank. Once a valid word is made via the letter selections, the word will be automatically crossed out in the word bank. The game is finished once all the words in the word bank are crossed out. The user can submit their score along with their name to a leaderboard. The leaderboard will display all game scores in descending order, along with the name, the board size, and category.

## Key Features

The project is built by separating the front-end and back-end into two separate folders. The front-end is built using HTML, CSS, JavaScript, and Bootstrap. It contains a header that displays buttons with options that change the board size and category, shows the scoreboard, resets the current game, or displays a help modal. The functionality of the buttons are as follows:
- If the user selects a board size or a category, a new board is fetched from the backend pertaining to the user's selection. The board is then displayed on the page, along with the list of words to find. Users can then play the game as described above. The user can submit their score to the leaderboard by clicking on the "Submit Score" button. The user will be prompted to enter their name. Once the user submits their score, the game is reset and a new game can be played.
- If the user clicks the scoreboard button the board and word bank are hidden to display the scoreboard, and the button changes to go back to the "Game". The scoreboard is then fetched from the backend. Here a user can edit their name or delete their score.
- If the user clicks the reset button, the game is reset and a new game can be played.
- If the user clicks the help button, a modal is displayed that explains the rules of the game.

## Project Architecture

### Root:

- **package.json**: Contains the dependencies and scripts used for the project.
- **package-lock.json**: Contains the dependencies and their versions used for the project.
- **README.md**: Contains this documentation for the project.
- **.gitignore**: Contains files and folders that are ignored by git.

### Frontend:

- **index.html**: Contains a main div that contains the header, board, word bank, and scoreboard. Outside of the main div are modals that are displayed when the user clicks on the help or submit score button. Bootstrap is used to style the page and keep a polished look.
- **style.css**: Contains custom styling for the page. This includes specific colors unavailable in Bootstrap, and styling for the modals. It also includes all the animations, transitions, and coloring used for the main board and word-bank.
- **main.js**: Contains calls to other JS files that are used to set up the main page. This includes loading saved states, fetching a new game on page load, settings up the views and button functionalities.
- **./controllers/\***:
    - **BoardController.js**: Contains functions that are used to fetch a new board from the backend, and to load the saved category and board size state.
    - **CategoryController.js**: Contains functions that are used to fetch a new category from the backend.
    - **GameController.js**: Contains functions that are used to load and save the board size and category states, and to create a new game.
    - **ScoreboardController.js**: Contains functions that are used to fetch the scoreboard from the backend, and to create, delete, and update a score.
- **./models/\***:
    - **BoardModel.js**: Contains a class that represents the board.
    - **CategoriesModel.js**: Contains a class that represents the categories.
    - **CoordsModel.js**: Contains a class that represents the coordinates of a letter in the board.
    - **GameModel.js**: Contains a class that represents the game.
- **./utils/\***:
    - **utils.js**: Contains a function that is used to format text fetched from the backend.
- **./views/\***:
    - **BoardView.js**: Contains functions responsible for displaying the board.
    - **CategoriesView.js**: Contains functions responsible for displaying the categories.
    - **GameView.js**: Contains functions responsible for displaying the game.
    - **ScoreboardView.js**: Contains functions responsible for displaying the scoreboard.
    - **index.js**: Contains functions responsible for displaying the main page by calling the functions in the other view files.

### Backend:

- **index.js**: Contains the main server code. It sets up the server using Express, along with any middlewares, a router for API calls, and a static folder for the front-end files.
- **./controllers/\***:
    - **BoardController.js**: Contains functions that are used to fetch a new board from the database. It responds with a JSON object containing the board and the list of words.
    - **CategoriesController.js**: Contains functions are used to fetch the categories from the database. It responds with a JSON object containing the categories.
    - **ScoreboardController.js**: Contains functions that are used to get, create, update, and delete scores from the backend. It responds with a JSON object containing the scoreboard or score modified.
- **./data/\***:
    - **categories.json**: Contains a JSON object that represents categories and words to insert into the database.
- **./middlewares/\***:
    - **BoardMiddleware.js**: Contains a middleware that is used to validate the board size and category sent from the front-end.
- **./models/\***:
    - Board.js: Contains a class that represents the board. This is responsible for creating a new board given a board size and list of words.
- **./routes/\***:
    - **route.js**: Contains the routes for the API calls. This includes routes for fetching a new board, fetching the categories, and fetching the scoreboard.
- **./services/\***:
    - **.env**: Contains environment variables that are used to connect to the database.
    - **DBService.js**: Contains functions that are used to connect to the database and execute queries.
    - **setupDB.js**: Contains functions that are used to set up the database. This includes creating the tables and inserting the categories and words found in ../data/categories.json.

## To Run Locally
- Clone the repository
- Run `npm install` to install the dependencies
- Run `npm start` to start the server
- Open a browser and go to `localhost:3000` to view the page

## Configuring and Connecting to the Database
The database is hosted on ElephantSQL. The credentials can be found in the ./backend/services/.env file.

To modify the categories and words in the database:
- Modify the ./backend/data/categories.json file in the following format:
    - Each key is a category. No spaces are allowed in the category name. Instead, use underscores.
    - Each value is an array of words.
    - Each word is a string. Special characters are removed from the words when inserting into the database.
- Run `npm run setup-db` to set up the database with the new categories and words

## Credits
- **Node.js**: https://nodejs.org/en/
- **Express**: https://expressjs.com/
- **Express Middlewares**:
    - **CORS**: https://www.npmjs.com/package/cors
    - **Morgan**: https://www.npmjs.com/package/morgan
- **Postgres**: https://www.postgresql.org/
- **ElephantSQL**: https://www.elephantsql.com/
- **Bootstrap**: https://getbootstrap.com/
- **Bootstrap Icons**: https://icons.getbootstrap.com/

## Authors
- [Jon Rubio](https://github.com/Osyki)
