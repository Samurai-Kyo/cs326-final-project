import { setupCategories } from "./CategoriesView.js";
import { setupBoardSizes } from "./BoardView.js";
import { resetGame, setButtons } from "./GameView.js";

/**
 * Sets up the page on load.
 */
function setupPage() {
  setupCategories();
  setupBoardSizes();
  setButtons();
  resetGame();
}

export { setupPage };
