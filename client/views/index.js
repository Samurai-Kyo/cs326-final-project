import { setupCategories } from "./CategoriesView.js";
import { setupBoardSizes, setBoard } from "./BoardView.js";

/**
 * Sets up the page on load.
 */
function setupPage() {
    setupCategories();
    setupBoardSizes();
    setBoard();

    // setGame();
    // setButtons();
  }


  export { setupPage };