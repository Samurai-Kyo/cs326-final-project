import { setupCategories } from "./controllers/CategoriesController.js";
import { setupBoard } from "./controllers/BoardController.js";
import { setupGame } from "./controllers/GameController.js";
import { setupPage } from "./views/index.js";

/**
 * Initializes the game.
 */
async function init() {
  await setupCategories();
  await setupBoard();
  await setupGame();
  setupPage();
}

await init();