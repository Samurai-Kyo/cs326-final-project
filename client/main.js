
const CATEGORIES = [];
// get text of span with id of "current-category"
const currentCategoryElement = document.getElementById("current-category");
console.log(currentCategoryElement.innerText);

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:3000/categories");
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.log(error);
  }
}

async function fetchBoard(size, category) {
  try {
    const response = await fetch("http://localhost:3000/board", {
      body: JSON.stringify({ size: size, category: category }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

let categories = [];

async function init() {
  await setupCategories();
}

async function setupCategories() {
  categories = await fetchCategories();
  categories = categories.map(
    (
      category // Capitalize first letter in each word and set underscores as spaces using regex
    ) =>
      category.replace(/(^\w{1})|(\_\w{1})/g, (match) =>
        match.toUpperCase().replace("_", " ")
      )
  );
  CATEGORIES.push(...categories);
  categories.sort();
  const categorySelect = document.getElementById("categories");

  const divider = document.createElement("li");
  divider.classList.add("dropdown-divider");
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = "#"; // FIXME: Add link to fetch category and reset page
    a.textContent = category;
    li.appendChild(a);
    categorySelect.appendChild(li);
    if (i < categories.length - 1) {
      categorySelect.appendChild(divider.cloneNode());
    }
  }
}


init();
