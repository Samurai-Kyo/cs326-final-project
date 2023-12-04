import Game from "../models/GameModel.js";
import { prettifyWord } from "../utils/utils.js";

let game = null;

// function handleGuess(game, guess) {
//   if (game.words.includes(guess)) {
//     game.foundWords.push(guess);
//     game.score += guess.length;
//     const wordBankElement = document.getElementById("word-bank");
//     const wordElements = wordBankElement.children;
//     for (let i = 0; i < wordElements.length; i++) {
//       const element = wordElements[i];
//       if (element.textContent === guess) {
//         element.classList.add("word-found");
//       }
//     }
//   }
//   game.guessWord = "";
// }

function letterGuess(event) {
  const target = event.target;
  const id = target.id;

  const coords = {
    letter: target.textContent,
    x: parseInt(id[0]),
    y: parseInt(id[2]),
  };

  if (game.letterAlreadyClicked(coords)) {
    removeLetterFromGuess(target, coords);
  } else {
    addLetterToGuess(target, coords);
  }
}

function addLetterToGuess(target, coords) {
  // FIXME: this is not working
  if (game.addLetterToGuess(coords)) {
    // const target = event.target;
    if (game.letterCoordsClicked.length > 0) {
      const lastLetterCoords =
        game.letterCoordsClicked[game.letterCoordsClicked.length - 1];
      const lastLetterId = `${lastLetterCoords.x}-${lastLetterCoords.y}`;
      const lastLetterElement = document.getElementById(lastLetterId);
      lastLetterElement.classList.remove("game-tile-last");
      lastLetterElement.classList.add("game-tile-selected");
    }
    target.classList.add("game-tile-last");
    const guessElement = document.getElementById("current-word");
    guessElement.textContent = game.guessWord;
    // todo: handleGuess(game, game.guessWord);
  } else {
    alert("Invalid letter! Select a letter adjacent to the last letter.");
  }
}

function removeLetterFromGuess(target, coords) {
  // FIXME: this is not working
  if (game.removeLetterFromGuess(coords)) {
    // const target = event.target;
    // remove class from last letter
    if (game.letterCoordsClicked.length > 0) {
      const lastLetterCoords =
        game.letterCoordsClicked[game.letterCoordsClicked.length - 1];
      const lastLetterId = `${lastLetterCoords.x}-${lastLetterCoords.y}`;
      const lastLetterElement = document.getElementById(lastLetterId);
      lastLetterElement.classList.remove("game-tile-last");
      lastLetterElement.classList.add("game-tile-selected");
    }
    target.classList.remove("game-tile-last");
    const guessElement = document.getElementById("current-word");
    guessElement.textContent = game.guessWord;
  } else {
    alert("Invalid letter! Select the last letter.");
  }
}

async function setupGame(board, category) {
  const newGame = new Game(board, category);

  const currentCategoryElement = document.getElementById("current-category");
  currentCategoryElement.textContent = prettifyWord(newGame.category);

  const gameBoardElement = document.getElementById("game-board");
  for (let i = 0; i < newGame.size; i++) {
    const row = document.createElement("div");
    row.classList.add("row", "flex-nowrap");

    for (let j = 0; j < newGame.size; j++) {
      const column = document.createElement("div");
      column.classList.add(
        "col",
        "border",
        "border-dark",
        "border-1",
        "game-tile",
        "aspect-ratio",
        "aspect-ratio-1x1",
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "font-weight-bold",
        "text-uppercase"
      );
      column.id = `${i}-${j}`;
      column.textContent = newGame.board[i][j];

      column.addEventListener("click", letterGuess);

      // column.textContent = game.board[i][j]; // Replace with your actual content
      row.appendChild(column);
    }

    gameBoardElement.appendChild(row);
  }

  const wordBankElement = document.getElementById("word-bank");
  for (let i = 0; i < newGame.words.length; i++) {
    const word = newGame.words[i];
    const div = document.createElement("div");
    div.classList.add("word-bank-word", "col-6");
    div.textContent = word;
    wordBankElement.appendChild(div);
  }

  game = newGame;
  return newGame;
}

export { setupGame };
