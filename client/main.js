import { setupCategories } from './controllers/CategoriesController.js';
import { setupBoard } from './controllers/BoardController.js';
import { setupGame } from './controllers/GameController.js';

async function init() {
  const categories = await setupCategories();
  categories.setCurrentCategory("pokemon");
  const board = await setupBoard(9, categories.currentCategoryId);
  const game = await setupGame(board, categories.currentCategory);
}

init();
