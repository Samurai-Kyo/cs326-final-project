class LetterCoord {
  /**
   * Creates a letter coordinate with the given letter, x, and y.
   * @param {char} letter
   * @param {int} x
   * @param {int} y
   */
  constructor(letter, x, y) {
    this.letter = letter;
    this.x = x;
    this.y = y;
  }
}

class LetterCoords {
  /**
   * Creates a list of letter coordinates that have been clicked.
   */
  constructor() {
    this.letterCoordsClicked = [];
  }

  /**
   * Checks to see if the letter coordinates are adjacent to the last letter clicked.
   * @param {LetterCoord} coords The letter coordinates to check
   * @returns a boolean if the letter is adjacent to the last letter clicked
   */
  adjacentToLastLetter(coords) {
    if (this.letterCoordsClicked.length === 0) {
      return true;
    }

    const lastCoords =
      this.letterCoordsClicked[this.letterCoordsClicked.length - 1];
    const xDiff = Math.abs(coords.x - lastCoords.x);
    const yDiff = Math.abs(coords.y - lastCoords.y);

    return xDiff <= 1 && yDiff <= 1;
  }

  /**
   * Checks if the letter has already been clicked.
   * @param {LetterCoord} coords The letter coordinates to check
   * @returns a boolean if the letter has already been clicked
   */
  letterAlreadyClicked(coords) {
    return this.letterCoordsClicked.some(
      (coord) => coord.x === coords.x && coord.y === coords.y
    );
  }

  /**
   * Adds a letter coordinates to the list of clicked letters.
   * @param {LetterCoord} coords The letter coordinates to add
   * @returns a boolean if the letter was added to the list of clicked letters
   */
  addLetterCoords(coords) {
    if (
      this.adjacentToLastLetter(coords) &&
      !this.letterAlreadyClicked(coords)
    ) {
      this.letterCoordsClicked.push(coords);
      return true;
    }
    return false;
  }

  /**
   * Removes the last letter coordinates from the list of clicked letters.
   * @param {LetterCoord} coords The letter coordinates to remove
   * @returns a boolean if the letter was removed from the list of clicked letters
   */
  removeLastLetter(coords) {
    if (this.letterCoordsClicked.length === 0) {
      return false;
    }

    const lastCoords =
      this.letterCoordsClicked[this.size - 1];

    if (lastCoords.x === coords.x && lastCoords.y === coords.y) {
      this.letterCoordsClicked.pop();
      return true;
    }

    return false;
  }

  /**
   * Gets the last letter coordinates.
   * @returns the last letter coordinates
   */
  lastLetterCoords() {
    if (this.letterCoordsClicked.length === 0) {
      return null;
    }

    return this.letterCoordsClicked[this.size - 1];
  }

  /**
   * Returns the size of the list of clicked letters.
   * @returns the size of the list of clicked letters
   */
  get size() {
    return this.letterCoordsClicked.length;
  }

    /**
     * Clears the list of clicked letters.
     */
    clear() {
        this.letterCoordsClicked = [];
    }
}

export { LetterCoords, LetterCoord };
