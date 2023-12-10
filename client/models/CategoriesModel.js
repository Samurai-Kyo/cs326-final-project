class Categories {
  constructor(categories) {
    this.categories = categories;
    this.currentCategory = categories[0];
    this.currentCategoryId = 1;
  }

  /**
   * Sets the current category.
   * @param {string} category The category name.
   */
  setCurrentCategory(category) {
    try {
      if (!this.categories.includes(category)) {
        throw new Error("Invalid category");
      }
      this.currentCategory = category;
      this.currentCategoryId = this.categories.indexOf(category) + 1;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Returns the category name with the given id.
   * @param {int} id The id of the category.
   * @returns {string} The category name.
   */
  getCategoryById(id) {
    try {
      if (id < 1 || id > this.categories.length) {
        throw new Error("Invalid category id");
      }
      return this.categories[id - 1];
    } catch (error) {
      console.log(error);
    }
  }
}

export default Categories;
