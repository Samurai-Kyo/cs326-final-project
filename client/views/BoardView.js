import { BOARD } from "../controllers/BoardController.js";
import { GAME } from "../controllers/GameController.js";
import { setupBoard } from "../controllers/BoardController.js";
import { setupGame, saveState } from "../controllers/GameController.js";
import { LetterCoord } from "../models/CoordsModel.js";
import { submitWord, resetGame } from "./GameView.js";

const BOARD_SIZES = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

/**
 * Setup the board size dropdown menu
 */
function setupBoardSizes() {
  const boardSizesElement = document.getElementById("board-sizes");
  const sizeElements = [];
  BOARD_SIZES.forEach((size) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.classList.add("dropdown-item");
    btn.classList.add("board-size-link");
    btn.innerText = size + " x " + size;
    li.appendChild(btn);
    btn.addEventListener("click", async () => {
      if (size !== BOARD.size) {
        BOARD.size = size;
        saveState();
        await setupBoard();
        await setupGame();
        resetGame();
      }
    });
    sizeElements.push(li);
  });

  for (let i = 0; i < sizeElements.length; i++) {
    const element = sizeElements[i];
    boardSizesElement.appendChild(element);
    if (i < sizeElements.length - 1) {
      const divider = document.createElement("li");
      divider.classList.add("dropdown-divider");
      boardSizesElement.appendChild(divider);
    }
  }
}

/**
 * Creates the main board.
 */
function setBoard() {
  const gameBoardElement = document.getElementById("game-board");
  gameBoardElement.innerHTML = "";
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
      column.id = `${i}-${j}`;
      column.textContent = GAME.board[i][j];
      column.addEventListener("click", tileClicked);
      row.appendChild(column);
    }
    gameBoardElement.appendChild(row);
  }
}

/**
 * Handles the click event on a tile.
 * @param {tile} event
 */
function tileClicked(event) {
  const target = event.target;
  const id = target.id;

  const hyphenIndex = id.indexOf("-");
  const x = parseInt(id.slice(0, hyphenIndex));
  const y = parseInt(id.slice(hyphenIndex + 1));
  const coords = new LetterCoord(target.textContent, x, y);

  const currentLetterCoord = GAME.letterCoords.lastLetterCoords();
  if (GAME.addLetterToGuess(coords)) {
    addLetterToGuess(target, currentLetterCoord);
  } else if (GAME.removeLetterFromGuess(coords)) {
    removeLastLetterFromGuess(target);
  } else {
    animateInvalidLetter(target);
  }
  submitWord();
}

/**
 * Blinks the tile red to show that it is not a valid letter.
 * @param {tile} target The tile that was clicked
 */
async function animateInvalidLetter(target) {
  const animate = async () => {
    target.classList.add("game-tile-invalid");
    await new Promise((resolve) => setTimeout(resolve, 500));
    target.classList.remove("game-tile-invalid");
  };

  if (target.classList.contains("game-tile-clicked")) {
    target.classList.remove("game-tile-clicked");
    await animate();
    target.classList.add("game-tile-clicked");
  } else {
    await animate();
  }
}

/**
 * Changes the style of the tile to show it is selected.
 * @param {tile} target
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
 * @param {tile} target
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

export { setupBoardSizes, setBoard };
