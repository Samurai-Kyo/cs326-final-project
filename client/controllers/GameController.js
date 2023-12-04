import Game from "../models/GameModel.js";
import { prettifyWord } from "../utils/utils.js";

let game = null;

// check with backend if word is valid
function submitWord() {
  alert("FIXME!");
}

function clearWord() {
  const guessElement = document.getElementById("current-word");
  guessElement.textContent = "";
  game.clearGuess();
  const lastLetterElement = document.querySelector(".game-tile-last");
  if (lastLetterElement) {
    lastLetterElement.classList.remove("game-tile-last");
  }
  const selectedLetters = document.querySelectorAll(".game-tile-selected");
  selectedLetters.forEach((letter) => {
    letter.classList.remove("game-tile-selected");
  });
}

function letterGuess(event) {
  const target = event.target;
  const id = target.id;

  const coords = {
    letter: target.textContent,
    x: parseInt(id[0]),
    y: parseInt(id[2]),
  };

  if (game.letterAlreadyClicked(coords)) {
    removeLastLetterFromGuess(target, coords);
  } else {
    addLetterToGuess(target, coords);
  }
}

function addLetterToGuess(target, coords) {
  if (game.addLetterToGuess(coords)) {
    if (game.letterCoordsClicked.length > 1) {
      const lastLetterCoords =
        game.letterCoordsClicked[game.letterCoordsClicked.length - 2];
      const lastLetterId = `${lastLetterCoords.x}-${lastLetterCoords.y}`;
      const lastLetterElement = document.getElementById(lastLetterId);
      lastLetterElement.classList.remove("game-tile-last");
      lastLetterElement.classList.add("game-tile-selected");
    }
    target.classList.add("game-tile-last");
    const guessElement = document.getElementById("current-word");
    guessElement.textContent = game.guessWord;
  } else {
    alert("Invalid letter! Can only select adjacent letters.");
  }
}

function removeLastLetterFromGuess(target, coords) {
  if (game.removeLetterFromGuess(coords)) {
    if (game.letterCoordsClicked.length > 0) {
      const lastLetterCoords =
        game.letterCoordsClicked[game.letterCoordsClicked.length - 1];
      const lastLetterId = `${lastLetterCoords.x}-${lastLetterCoords.y}`;
      const lastLetterElement = document.getElementById(lastLetterId);
      lastLetterElement.classList.add("game-tile-last");
      lastLetterElement.classList.remove("game-tile-selected");
    }
    target.classList.remove("game-tile-last");
    const guessElement = document.getElementById("current-word");
    guessElement.textContent = game.guessWord;
  } else {
    alert("Invalid letter! Can only remove the last letter.");
  }
}

async function setupGame(board, category) {
  const newGame = new Game(board, category);

  const currentCategoryElement = document.getElementById("current-category");
  currentCategoryElement.textContent = prettifyWord(newGame.category);

  const gameBoardElement = document.getElementById("game-board");
  for (let i = 0; i < newGame.size; i++) {
    const row = document.createElement("div");
    row.classList.add("row", "flex-nowrap");

    for (let j = 0; j < newGame.size; j++) {
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
      column.id = `${i}-${j}`;
      column.textContent = newGame.board[i][j];
      column.addEventListener("click", letterGuess);
      row.appendChild(column);
    }
    gameBoardElement.appendChild(row);
  }

  const wordBankElement = document.getElementById("word-bank");
  for (let i = 0; i < newGame.words.length; i++) {
    const word = newGame.words[i];
    const div = document.createElement("div");
    div.classList.add("word-bank-word", "col-6");
    div.textContent = word;
    wordBankElement.appendChild(div);
  }

  const submitButton = document.getElementById("submit-word");
  const clearButton = document.getElementById("clear-word");

  submitButton.addEventListener("click", submitWord);
  clearButton.addEventListener("click", clearWord);
  
  game = newGame;
  return newGame;
}

export { setupGame };
