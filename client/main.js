
// const CATEGORIES = [];
let SIZE = 10; // default size

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

async function setupCategories() {
  const categoryNames = await fetchCategories();
  const categoryNamesFixed = categoryNames.map(
    (
      category // Capitalize first letter in each word and set underscores as spaces using regex
    ) =>
      category.replace(/(^\w{1})|(\_\w{1})/g, (match) =>
        match.toUpperCase().replace("_", " ")
      )
  );

  const categoryElements = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const category = categoryNames[i];
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = "#"; // FIXME: Add link to fetch category and reset page
    a.id = category;
    a.textContent = categoryNamesFixed[i];
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
}




async function init() {
  await setupCategories();
}

init();
