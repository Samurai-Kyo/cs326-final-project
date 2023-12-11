import { LetterCoords, LetterCoord } from "./CoordsModel.js";

export class Game {
  /**
   * Creates a new Game object with uninitialized values.
   * @param {string} user The user's name
   */
  constructor(user = "") {
    this.score = 0;
    this.guessWord = "";
    this.foundWords = [];
    this.user = user;
    this.letterScores = {
      A: 10,
      B: 3,
      C: 3,
      D: 6,
      E: 10,
      F: 3,
      G: 4,
      H: 3,
      I: 9,
      J: 1,
      K: 2,
      L: 5,
      M: 3,
      N: 5,
      O: 8,
      P: 3,
      Q: 1,
      R: 7,
      S: 7,
      T: 7,
      U: 4,
      V: 2,
      W: 2,
      X: 1,
      Y: 2,
      Z: 1,
    };

    this.letterCoords = new LetterCoords();
  }

  /**
   * Creates a new game.
   * @param {obj} board The board object
   * @param {obj} category The category object
   */
  newGame(board, category) {
    this.category = category;
    this.board = board.board;
    this.boardSize = board.size;
    this.words = board.words;
    this.foundWords = [];
    this.score = 0;
    this.guessWord = "";
    this.letterCoords = new LetterCoords();
  }

  /**
   * Checks if a word is valid.
   * @param {string} word
   * @returns if the word is valid
   */
  isValidWord(word) {
    return this.words.includes(word);
  }

  /**
   * Checks if a word has already been found.
   * @param {string} word
   * @returns if the word has already been found
   */
  isFoundWord(word) {
    return this.foundWords.includes(word);
  }

  /**
   * Adds a word to the found words list.
   * @param {string} word
   * @returns a boolean if the word was added to the found words list
   */
  addFoundWord(word) {
    if (!this.isFoundWord(word) && this.isValidWord(word)) {
      this.foundWords.push(word);
      this.score += this._calculateScore(word);
      return true;
    }
    return false;
  }

  /**
   * Calculates the score of a word.
   * @param {string} word
   * @returns the score of the word
   */
  _calculateScore(word) {
    let score = 0;
    for (const letter of word) {
      score += this.letterScores[letter];
    }
    return score;
  }

  /**
   * Adds a letter to the guess word.
   * @param {LetterCoord} coords
   * @returns a boolean if the letter was added to the guess word
   */
  addLetterToGuess(coords) {
    if (this.letterCoords.addLetterCoords(coords)) {
      const letter = coords.letter;
      this.guessWord = this.guessWord + letter;
      return true;
    }
    return false;
  }

  /**
   * Removes the last letter from the guess word.
   * @param {LetterCoord} coords
   * @returns a boolean if the letter was removed from the guess word
   */
  removeLetterFromGuess(coords) {
    if (this.letterCoords.removeLastLetter(coords)) {
      this.guessWord = this.guessWord.slice(0, -1);
      return true;
    }
    return false;
  }

  /**
   * Clears the guess word and the clicked letter coordinates.
   */
  clearGuess() {
    this.guessWord = "";
    this.letterCoords.clear();
  }

  /**
   * Gets the size of the clicked letter coordinates.
   * @returns the size of the clicked letter coordinates
   */
  get clickedCoordsSize() {
    return this.letterCoords.size();
  }
}
