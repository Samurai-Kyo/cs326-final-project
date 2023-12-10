import Categories from "../models/CategoriesModel.js";
import { prettifyWord } from "../utils/utils.js";

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

  return new Categories(categoryNames);
}

export { setupCategories };
