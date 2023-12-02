import Game from "../models/GameModel.js";
import { prettifyWord } from "../utils/utils.js";

async function setupGame(board, categories) {
  const game = new Game(board, categories);

  const currentCategoryElement = document.getElementById("current-category");
  currentCategoryElement.textContent = prettifyWord(game.category);

  const gameBoardElement = document.getElementById("game-board");
  for (let i = 0; i < game.size; i++) {
    const row = document.createElement("div");
    row.classList.add("row", "flex-nowrap");

    for (let j = 0; j < game.size; j++) {
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
      column.textContent = game.board[i][j]; // Replace with your actual content
      row.appendChild(column);
    }

    gameBoardElement.appendChild(row);
  }

  // const gameBoard = document.getElementById("game-board");
  // gameBoard.addEventListener("click", (event) => {
  //     const tile = event.target;
  //     if (tile.classList.contains("game-tile")) {
  //         const tileId = tile.id.split("-");
  //         const row = parseInt(tileId[0]);
  //         const column = parseInt(tileId[1]);
  //         const word = game.words[row][column];
  //         const wordElement = document.getElementById("current-word");
  //         wordElement.textContent = word;
  //         game.currentWord = word;
  //     }
  // });

  const wordBankElement = document.getElementById("word-bank");
  for (let i = 0; i < game.words.length; i++) {
    const word = game.words[i];
    const div = document.createElement("div");
    div.classList.add("word-bank-word", "col-6");
    div.textContent = word;
    wordBankElement.appendChild(div);
  }

  // const submitButton = document.getElementById("submit-word");
  // submitButton.addEventListener("click", (event) => {
  //     event.preventDefault();
  //     const wordElement = document.getElementById("current-word");
  //     const word = wordElement.textContent;
  //     if (word.length > 0) {
  //         const wordList = document.getElementById("word-list");
  //         const li = document.createElement("li");
  //         li.classList.add("list-group-item");
  //         li.textContent = word;
  //         wordList.appendChild(li);
  //         game.score += word.length;
  //         const scoreElement = document.getElementById("score");
  //         scoreElement.textContent = game.score;
  //         wordElement.textContent = "";
  //         game.currentWord = "";
  //     }
  // });

  // const clearButton = document.getElementById("clear-word");
  // clearButton.addEventListener("click", (event) => {
  //     event.preventDefault();
  //     const wordElement = document.getElementById("current-word");
  //     wordElement.textContent = "";
  //     game.currentWord = "";
  // });

  // const resetButton = document.getElementById("reset-game");
  // resetButton.addEventListener("click", (event) => {
  //     event.preventDefault();
  //     const wordElement = document.getElementById("current-word");
  //     wordElement.textContent = "";
  //     game.currentWord = "";
  //     const wordList = document.getElementById("word-list");
  //     wordList.innerHTML = "";
  //     game.score = 0;
  //     const scoreElement = document.getElementById("score");
  //     scoreElement.textContent = game.score;
  // });

  return game;
}

export { setupGame };
