import { setupCategories } from './controllers/CategoriesController.js';
import { setupBoard } from './controllers/BoardController.js';
import { setupGame } from './controllers/GameController.js';

async function init() {
  const categories = await setupCategories();
  const board = await setupBoard(5, 1);
  const game = await setupGame(board, categories.currentCategory);
}

init();
