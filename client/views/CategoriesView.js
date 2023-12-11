import { CATEGORIES } from "../controllers/CategoriesController.js";
import { setupBoard } from "../controllers/BoardController.js";
import { setupGame, saveState } from "../controllers/GameController.js";
import { prettifyWord } from "../utils/utils.js";
import { resetGame } from "./GameView.js";

/**
 * Links the category buttons to the categories.
 */
function linkCategories() {
  const categoryButtons = document.querySelectorAll(".category-link");
  categoryButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.id !== CATEGORIES.currentCategory) {
        CATEGORIES.setCurrentCategory(button.id);
        saveState();
        await setupBoard();
        await setupGame();
        resetGame();
      }
    });
  });
}

/**
 * Sets up the category dropdown menu.
 */
function setupCategories() {
  const categoryNames = CATEGORIES.categories;
  const categoryElements = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const category = categoryNames[i];
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.classList.add("dropdown-item");
    btn.classList.add("category-link");
    btn.id = category;
    btn.innerText = prettifyWord(category);
    li.appendChild(btn);
    categoryElements.push(li);
  }
  categoryElements.sort((a, b) => {
    if (a.textContent < b.textContent) {
      return -1;
    }
    if (a.textContent > b.textContent) {
      return 1;
    }
    return 0;
  });

  const categorySelect = document.getElementById("categories");
  for (let i = 0; i < categoryElements.length; i++) {
    const element = categoryElements[i];
    categorySelect.appendChild(element);
    if (i < categoryElements.length - 1) {
      const divider = document.createElement("li");
      divider.classList.add("dropdown-divider");
      categorySelect.appendChild(divider);
    }
  }
  linkCategories();
}

export { setupCategories };
