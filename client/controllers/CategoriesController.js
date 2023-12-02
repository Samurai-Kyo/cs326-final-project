import Categories from "../models/CategoriesModel.js";
import { prettifyWord } from "../utils/utils.js";

// const categories = new Categories();

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:3000/categories");
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.log(error);
  }
}

async function setupCategories() {
  const categoryNames = await fetchCategories();

  const categoryElements = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const category = categoryNames[i];
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = "#"; // FIXME: Add link to fetch category and reset page
    a.id = category;
    a.textContent = prettifyWord(categoryNames[i]);
    li.appendChild(a);
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

  return new Categories(categoryNames);
}

export { setupCategories };
