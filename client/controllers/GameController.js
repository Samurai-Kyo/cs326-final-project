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
  const x = parseInt(id[0]);
  const y = parseInt(id[2]);
  const letter = game.board[x][y];

  //FIXME: need to fix
  // const letterCoords = game.letterCoordsClicked[letter];
  // if (
  //   letterCoords &&
  //   letterCoords.some((coord) => coord.x === x && coord.y === y)
  // ) {
  //   let letterCoord = letterCoords.find(
  //     (coord) => coord.x === x && coord.y === y
  //   );
  //   letterCoords.splice(letterCoords.indexOf(letterCoord), 1);
  //   removeLetterFromGuess(event, letterCoord);
  // }

  if (game.guessWord.includes(letter)) {
    removeLetterFromGuess(event);
  } else {
    addLetterToGuess(event);
  }
}

function addLetterToGuess(event) {
  const target = event.target;
  target.classList.add("game-tile-selected");
  const letter = target.textContent;
  game.guessWord = game.guessWord + letter;
  const guessElement = document.getElementById("current-word");
  guessElement.textContent = prettifyWord(game.guessWord);
  // handleGuess(game, game.guessWord);
}

function removeLetterFromGuess(event) {
  const target = event.target;
  target.classList.remove("game-tile-selected");
  const letter = target.textContent;
  game.guessWord = game.guessWord.replace(letter, "");
  const guessElement = document.getElementById("current-word");
  guessElement.textContent = prettifyWord(game.guessWord);
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
