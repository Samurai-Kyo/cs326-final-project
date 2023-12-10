import { setupCategories } from "./controllers/CategoriesController.js";
import { setupBoard } from "./controllers/BoardController.js";
import { setupGame } from "./controllers/GameController.js";

const categories = await setupCategories();
let boardSize;
let board = null;
let game = null;
await init();

const resetButton = document.getElementById("reset-game");
const submitButton = document.getElementById("submit-score-db");
const nameInput = document.getElementById("user-name");
const scoreInput = document.getElementById("score");

submitButton.addEventListener("click", submitScore);
resetButton.addEventListener("click", resetGame);
linkCategories();
addBoardSizes();

function linkCategories() {
  const categoryButtons = document.querySelectorAll(".category-link");
  categoryButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      categories.setCurrentCategory(button.id);
      board = await setupBoard(boardSize, categories.currentCategoryId);
      game = await setupGame(board, categories.currentCategory);
      saveState();
    });
  });
}

function addBoardSizes() {
  const boardSizesElement = document.getElementById("board-sizes");
  const boardSizes = [5, 6, 7, 8, 9, 10, 11, 12];
  boardSizes.forEach((size) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.classList.add("dropdown-item");
    btn.classList.add("board-size-link");
    btn.id = size;
    btn.innerText = size + " x " + size;
    li.appendChild(btn);
    boardSizesElement.appendChild(li);
    btn.addEventListener("click", async () => {
      boardSize = size;
      board = await setupBoard(boardSize, categories.currentCategoryId);
      game = await setupGame(board, categories.currentCategory);
      saveState();
    });
  });
}

export async function resetGame() {
  nameInput.value = "";
  board = await setupBoard(boardSize, categories.currentCategoryId);
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
    await response.json();
    resetGame();
  } catch (error) {
    console.log(error);
  }
}

function saveState() {
  const state = {
    size: boardSize,
    category: categories.currentCategory
  }
  localStorage.setItem('state', JSON.stringify(state));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem('state'));
  if (state) {
    boardSize = state.size;
    categories.setCurrentCategory(state.category);
    return true;
  }
  return false;
}

async function init() {
  if (!loadState()) {
    boardSize = 5;
    categories.setCurrentCategory("animals");
  }
  board = await setupBoard(boardSize, categories.currentCategoryId);
  game = await setupGame(board, categories.currentCategory);
}