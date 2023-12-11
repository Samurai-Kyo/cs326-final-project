import { GAME, setupGame } from "../controllers/GameController.js";
import { BOARD, setupBoard } from "../controllers/BoardController.js";
import { CATEGORIES } from "../controllers/CategoriesController.js";
import { prettifyWord } from "../utils/utils.js";
import { setBoard } from "./BoardView.js";

/**
 * Sets up the word bank.
 */
function setWordBank() {
  const wordBankElement = document.getElementById("word-bank");
  wordBankElement.innerHTML = "";
  for (let i = 0; i < GAME.words.length; i++) {
    const word = GAME.words[i];
    const div = document.createElement("div");
    div.classList.add("word-bank-word", "col-6");
    div.textContent = word;
    div.id = `word-${i}`;
    wordBankElement.appendChild(div);
  }
}

/**
 * Sets up the title for the current category.
 */
function setCategory() {
  const currentCategoryElement = document.getElementById("current-category");
  currentCategoryElement.textContent = prettifyWord(GAME.category);
}

/**
 * Sets up the buttons for the game.
 */
function setButtons() {
  const resetButton = document.getElementById("reset-game");
  resetButton.addEventListener("click", resetGame);

  const submitButton = document.getElementById("submit-score-db");
  submitButton.addEventListener("click", submitScore);

  const clearButton = document.getElementById("clear-word");
  clearButton.addEventListener("click", clearWord);
}

/**
 * Resets the game.
 */
async function resetGame() {
  await setupBoard();
  await setupGame();
  const nameInput = document.getElementById("user-name");
  nameInput.value = "";
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = "0";
  setGame();
}

/**
 * Submits the score to the database.
 */
async function submitScore() {
  try {
    const name = nameInput.value;
    const score = scoreInput.innerText;
    const category_id = CATEGORIES.currentCategoryId;
    const board_size = BOARD.size;
    const body = { name, score, category_id, board_size };
    const response = await fetch("/scoreboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await response.json();
    resetGame();
  } catch (error) {
    console.log(error);
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

function setGame() {
  setBoard();
  setWordBank();
}

export { setGame, submitWord };
