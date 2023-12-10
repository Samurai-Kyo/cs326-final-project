import { prettifyWord } from "../utils/utils.js";
const scoreboardTableBody = document.getElementById("scoreboard-body");

async function getScores() {
  try {
    const response = await fetch("/scoreboard");
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.log(error);
  }
}

const addScore = (score, i) => {
  const row = document.createElement("tr");
  const rankElement = document.createElement("th");
  const name = document.createElement("td");
  const scoreElement = document.createElement("td");
  const size = document.createElement("td");
  const category = document.createElement("td");
  const deleteScore = document.createElement("td");
  rankElement.innerText = i+1;
  
  name.classList.add("score-name");
  const editIcon = document.createElement("i");
  editIcon.classList.add("bi");
  editIcon.classList.add("bi-pencil-square");
  editIcon.classList.add("visually-hidden");

  const inputBox = document.createElement("input");
  inputBox.type = "text";
  inputBox.value = score.name;
  inputBox.classList.add("edit-name");
  name.addEventListener("mouseover", () => {
    editIcon.classList.remove("visually-hidden");
  });

  name.addEventListener("mouseout", () => {
    editIcon.classList.add("visually-hidden");
  } );
  inputBox.addEventListener("blur", async () => {
    try {
      const response = await fetch(`/scoreboard/${score.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inputBox.value }),
      });
      if (!response.ok) {
        throw new Error("Could not edit score");
      }
      await response.json();
    } catch (error) {
      console.log(error);
    }
  });
  inputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        inputBox.blur();
    }
  });
  name.appendChild(inputBox);
  name.appendChild(editIcon);

  scoreElement.innerText = score.score;
  size.innerText = score.board_size + " x " + score.board_size;
  category.innerText = prettifyWord(score.category);
  deleteScore.innerHTML = `<i class="bi bi-trash3-fill delete-icon"></i>`;
  deleteScore.addEventListener("click", async () => {
    try {
      const response = await fetch(`/scoreboard/${score.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Could not delete score");
      }
      await response.json();
      row.remove();
    } catch (error) {
      console.log(error);
    }
  });
  row.appendChild(rankElement);
  row.appendChild(name);
  row.appendChild(scoreElement);
  row.appendChild(size);
  row.appendChild(category);
  row.appendChild(deleteScore);
  scoreboardTableBody.appendChild(row);
};

export { getScores, addScore };
