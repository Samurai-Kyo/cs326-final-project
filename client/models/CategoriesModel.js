class Categories {
  constructor(categories) {
    this.categories = categories;
    this.currentCategory = categories[0];
    this.currentCategoryId = 1;
  }

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
}

export default Categories;
