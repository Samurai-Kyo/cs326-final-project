import { Game } from "../models/GameModel.js";
import { BOARD } from "./BoardController.js";
import { CATEGORIES } from "./CategoriesController.js";

const GAME = new Game();

/**
 * Saves the current board options to local storage.
 */
function saveState() {
  console.log("saving state");
  const state = {
    size: BOARD.size,
    category: CATEGORIES.currentCategory,
  };
  console.log(`Saved: ${state}`);
  localStorage.setItem("state", JSON.stringify(state));
}

/**
 * Loads the saved board options from local storage.
 */
function loadState() {
  const state = JSON.parse(localStorage.getItem("state"));
  console.log("loading state");
  if (state) {
    CATEGORIES.setCurrentCategory(state.category);
    BOARD.size = state.size;
    console.log(`Loaded: ${JSON.stringify(state)}`);
  } else {
    console.log("no state found");
  }
}

/**
 * Sets up the game board.
 */
async function setupGame() {
  GAME.newGame(BOARD, CATEGORIES.currentCategory);
}

export { setupGame, GAME, saveState, loadState };
