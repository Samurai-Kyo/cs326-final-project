import { Game } from "../models/GameModel.js";
import { LetterCoord } from "../models/CoordsModel.js";
import { prettifyWord } from "../utils/utils.js";

const GAME = new Game();

/**
 * Submits the current word.
 */
async function submitWord() {
  const guessElement = document.getElementById("current-word");
  const guess = guessElement.textContent;
  if (GAME.addFoundWord(guess)) {
    // get all tiles that are part of the word and add a class to them
    const coords = GAME.letterCoords.letterCoordsClicked;

    // cross out the word in the word bank
    const index = GAME.words.indexOf(guess);
    const wordElement = document.getElementById(`word-${index}`);
    wordElement.classList.add("word-found");
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = GAME.score;

    
    clearWord();
    // change each tile found to have a different color
    for (const coord of coords) {
      const id = `${coord.x}-${coord.y}`;
      const tile = document.getElementById(id);
      tile.classList.add("game-tile-found");
      tile.classList.add("game-tile-animate");
    }

    // wait for animation to finish
    await new Promise((resolve) => setTimeout(resolve, 500));
    // remove animation class after animation is done
    for (const coord of coords) {
      const id = `${coord.x}-${coord.y}`;
      const tile = document.getElementById(id);
      tile.classList.remove("game-tile-animate");
    }
  }
}

/**
 * Clears the current word.
 */
function clearWord() {
  const guessElement = document.getElementById("current-word");
  guessElement.textContent = "";
  GAME.clearGuess();
  const lastLetterElement = document.querySelector(".game-tile-head");
  if (lastLetterElement) {
    lastLetterElement.classList.remove("game-tile-head");
  }
  const selectedLetters = document.querySelectorAll(".game-tile-clicked");
  selectedLetters.forEach((letter) => {
    letter.classList.remove("game-tile-clicked");
  });
}

/**
 * Handles the click event on a tile.
 * @param {game-tile} event
 */
function tileClicked(event) {
  const target = event.target;
  const id = target.id;

  const coords = new LetterCoord(
    target.textContent,
    parseInt(id[0]),
    parseInt(id[2])
  );

  const currentLetterCoord = GAME.letterCoords.lastLetterCoords();
  // console.log(`Current letter: ${currentLetterCoord.x}-${currentLetterCoord.y}`);
  if (GAME.addLetterToGuess(coords)) {
    console.log(`Adding letter: ${coords.x}-${coords.y}`);
    addLetterToGuess(target, currentLetterCoord);
  } else if (GAME.removeLetterFromGuess(coords)) {
    console.log(`Removing letter: ${coords.x}-${coords.y}`);
    removeLastLetterFromGuess(target);
  } else {
    alert("Select adjacent letters to add or last letter to remove.");
  }

  submitWord();
}

/**
 * Changes the style of the tile to show it is selected.
 * @param {game-tile} target
 * @param {LetterCoord} lastLetterCoord
 */
function addLetterToGuess(target, lastLetterCoord) {
  if (lastLetterCoord) {
    const lastLetterId = `${lastLetterCoord.x}-${lastLetterCoord.y}`;
    const lastLetterElement = document.getElementById(lastLetterId);
    lastLetterElement.classList.remove("game-tile-head");
    lastLetterElement.classList.add("game-tile-clicked");
  }
  target.classList.add("game-tile-head");
  const guessElement = document.getElementById("current-word");
  guessElement.textContent = GAME.guessWord;
}

/**
 * Changes the style of the tile to show it is unselected.
 * @param {game-tile} target
 */
function removeLastLetterFromGuess(target) {
  const lastLetterCoord = GAME.letterCoords.lastLetterCoords();
  if (lastLetterCoord) {
    const lastLetterId = `${lastLetterCoord.x}-${lastLetterCoord.y}`;
    const lastLetterElement = document.getElementById(lastLetterId);
    lastLetterElement.classList.remove("game-tile-clicked");
    lastLetterElement.classList.add("game-tile-head");
  }
  target.classList.remove("game-tile-head");
  const guessElement = document.getElementById("current-word");
  guessElement.textContent = GAME.guessWord;
}

/**
 * Sets up the game board.
 * @param {Board} board The board object
 * @param {Category} category The category object
 * @returns The game object
 */
async function setupGame(board, category) {
  GAME.newGame(board, category);

  const currentCategoryElement = document.getElementById("current-category");
  currentCategoryElement.textContent = prettifyWord(GAME.category);
  console.log(GAME.category);

  const gameBoardElement = document.getElementById("game-board");
  for (let i = 0; i < GAME.boardSize; i++) {
    const row = document.createElement("div");
    row.classList.add("row", "flex-nowrap");

    for (let j = 0; j < GAME.boardSize; j++) {
      const column = document.createElement("div");
      column.classList.add(
        "col",
        "border",
        "border-dark",
        "border-1",
        "game-tile",
        "aspect-ratio",
        "aspect-ratio-1x1",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "font-weight-bold",
        "text-uppercase"
      );
      //FIXME: is a problem if the board size is greater than 9
      column.id = `${i}-${j}`;
      column.textContent = GAME.board[i][j];
      column.addEventListener("click", tileClicked);
      row.appendChild(column);
    }
    gameBoardElement.appendChild(row);
  }

  const wordBankElement = document.getElementById("word-bank");
  for (let i = 0; i < GAME.words.length; i++) {
    const word = GAME.words[i];
    const div = document.createElement("div");
    div.classList.add("word-bank-word", "col-6");
    div.textContent = word;
    div.id = `word-${i}`;
    wordBankElement.appendChild(div);
  }

  const clearButton = document.getElementById("clear-word");

  clearButton.addEventListener("click", clearWord);

  return GAME;
}

export { setupGame };
