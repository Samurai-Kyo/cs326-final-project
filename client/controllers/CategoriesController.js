import Categories from "../models/CategoriesModel.js";

const CATEGORIES = new Categories();

/***
 * Fetches the categories from the server.
 */
async function fetchCategories() {
  try {
    const response = await fetch("https://cs326-final-project-web.onrender.com/categories");
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sets up the categories.
 */
async function setupCategories() {
  const categoryNames = await fetchCategories();
  CATEGORIES.setCategories(categoryNames);
}

export { CATEGORIES, setupCategories };
