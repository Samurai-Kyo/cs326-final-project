class Game {
  constructor(board, category) {
    this.board = board.board;
    this.category = category;
    this.words = board.words;
    this.size = board.size;
    this.score = 0;
    this.guessWord = "";
    this.letterCoordsClicked = [];
    this.foundWords = [];
  }

  checkValidLetter(coords) {
    return this.board[coords.x][coords.y] === coords.letter;
  }

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

  letterAlreadyClicked(coords) {
    return this.letterCoordsClicked.some(
      (coord) => coord.x === coords.x && coord.y === coords.y
    );
  }

  addLetterToGuess(coords) {
    if (
      this.checkValidLetter(coords) &&
      this.adjacentToLastLetter(coords) &&
      !this.letterAlreadyClicked(coords)
    ) {
      const letter = coords.letter;
      this.letterCoordsClicked.push(coords);
      this.guessWord = this.guessWord + letter;
        return true;
    }
    return false;
  }

  isLastLetter(coords) {
    if (this.letterCoordsClicked.length === 0) {
      return false;
    }

    const lastCoords =
      this.letterCoordsClicked[this.letterCoordsClicked.length - 1];

    return lastCoords.x === coords.x && lastCoords.y === coords.y;
  }

  removeLetterFromGuess(coords) {
    if (this.checkValidLetter(coords) && this.isLastLetter(coords)) {
      this.letterCoordsClicked.pop();
      this.guessWord = this.guessWord.slice(0, -1);
      return true;
    }
    return false;
  }

  clearGuess() {
    this.letterCoordsClicked = [];
    this.guessWord = "";
  }
}

export default Game;
