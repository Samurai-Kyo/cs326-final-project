import Board from "../models/BoardModel.js";
import { CATEGORIES } from "./CategoriesController.js";
import { loadState } from "./GameController.js";

const BOARD = new Board();

/**
 * Sends a request to the server to get a new board.
 * @returns {obj} An object containing the board and the words.
 */
async function fetchBoard() {
  try {
    const response = await fetch("/board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        size: BOARD.size,
        category: CATEGORIES.currentCategoryId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sets up a new board.
 */
async function setupBoard() {
  try {
    loadState();
    const boardData = await fetchBoard();
    const words = boardData.words.map((word) => word.toUpperCase());
    BOARD.setBoard(boardData.board, words);
  } catch (error) {
    console.log(error);
  }
}

export { BOARD, setupBoard };
