import { setupCategories } from "./controllers/CategoriesController.js";
import { setupBoard } from "./controllers/BoardController.js";
import { setupGame } from "./controllers/GameController.js";

const categories = await setupCategories();
let size = 10;
let board = await setupBoard(size, categories.currentCategoryId);
let game = await setupGame(board, categories.currentCategory);

const resetButton = document.getElementById("reset-game");
const submitButton = document.getElementById("submit-score-db");
const nameInput = document.getElementById("user-name");
const scoreInput = document.getElementById("score");

submitButton.addEventListener("click", submitScore);
resetButton.addEventListener("click", resetGame);

export async function resetGame() {
  nameInput.value = "";
  board = await setupBoard(size, categories.currentCategoryId);
  game = await setupGame(board, categories.currentCategory);
}


export async function submitScore() {
  try {
    const name = nameInput.value;
    const score = scoreInput.innerText;
    const category_id = categories.currentCategoryId;
    const board_size = board.size;
    const body = { name, score, category_id, board_size };
    const response = await fetch("/scoreboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    resetGame();
  } catch (error) {
    console.log(error);
  }
}
