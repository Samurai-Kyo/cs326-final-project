class Board {
  letterPositions = {}; // { letter: [{ x, y }, {x ,y}, ... {x, y}] }
  placedWords = []; // [word, word, ...]

  /**
   * Creates a board with the given word list and size
   * @param {[string]} wordList The list of words to place on the board
   * @param {int} size The size of the board
   */
  constructor(wordList, size) {
    this.board =  Array.from(Array(size), () => Array(size).fill(null));
    this._placeWords(wordList);
  }

  /**
   * Attempts to place all words on the board
   * @param {[string]} wordList The list of words to place on the board
   * @returns if all words were placed
   */
  _placeWords(wordList) {
    if (wordList.length === 0) {
      return;
    }
    // shuffle the word list
    const shuffledWords = this._shuffle(wordList);

    // place the words
    while (shuffledWords.length > 0) {
      let word = shuffledWords.pop();
      let placed = false;
      // try random position first
      let x = Math.floor(Math.random() * this.board.length);
      let y = Math.floor(Math.random() * this.board.length);
      if (this._placeWord(word, x, y)) {
        placed = true;
      } else if (this.letterPositions[word[0]]) { 
        // if letter exists on board, try those positions
        let count = 0;
        while (!placed && count < this.letterPositions[word[0]].length) {
          const { x, y } = this.letterPositions[word[0]][count];
          placed = this._placeWord(word, x, y);
          count++;
        }
      } else {
        // if letter doesn't exist on board, filter every empty tiles and try to place word
        let emptyTiles = [];
        this.board.forEach((row, x) => {
          row.forEach((tile, y) => {
            if (tile === null) {
              emptyTiles.push({ x, y });
            }
          });
        });
        // shuffle empty tiles
        emptyTiles = this._shuffle(emptyTiles);
        while (!placed && emptyTiles.length > 0) {
          const { x, y } = emptyTiles.pop();
          placed = this._placeWord(word, x, y);
        }
      }
      if (placed) {
        this.placedWords.push(word);
      }
    }

    // fill in empty tiles with random letters
    this.board.forEach((row, x) => {
      row.forEach((tile, y) => {
        if (tile === null) {
          this.board[x][y] = String.fromCharCode(
            Math.floor(Math.random() * 26) + 65
          );
        }
      });
    });
  }

  /**
   * Attempts to place a word on the board starting at the given position
   * @param {string} word The word to place
   * @param {int} x The x position to start placing the word (0-indexed)
   * @param {int} y The y position to start placing the word (0-indexed)
   * @returns A boolean indicating if the word was placed
   */
  _placeWord(word, x, y) {
    word = word.toUpperCase().split("");
    const directions = ["north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest"];

    const place = (wordArr, x, y, usedCoords) => {
      if (wordArr.length === 0) {
        Object.keys(usedCoords).forEach((letter) => {
          this.letterPositions[letter] = [
            ...(this.letterPositions[letter] || []),
            ...usedCoords[letter],
          ];
        });
        return true;
      }

      const usedCoord = usedCoords[wordArr[0]].some(
        (coord) => coord.x === x && coord.y === y
      );

      // check outside bounds
      if (
        x < 0 ||
        x >= this.board.length ||
        y < 0 ||
        y >= this.board.length ||
        usedCoord
      ) {
        return false;
      }

      // check if can place tile
      if (
        this.board[x][y] === null ||
        this.board[x][y] === wordArr[0] ||
        !usedCoords
      ) {
        // place tile
        // console.log(`Placing ${wordArr[0]} at ${x}, ${y}`);
        const tile = this.board[x][y];
        this.board[x][y] = wordArr[0];
        usedCoords[wordArr[0]].push({ x, y });

        // check if word can be placed in any direction
        // shuffle the directions
        const shuffledDirections = this._shuffle([...directions]);
        for (const dir of shuffledDirections) {
          const [dx, dy] = {
            north: [-1, 0],
            south: [1, 0],
            east: [0, 1],
            west: [0, -1],
            northeast: [-1, 1],
            northwest: [-1, -1],
            southeast: [1, 1],
            southwest: [1, -1],
          }[dir];

          if (place(wordArr.slice(1), x + dx, y + dy, usedCoords)) {
            return true;
          }
        }

        // if the word can't be placed in any direction, remove tile and return false
        this.board[x][y] = tile;
        return false;
      }

      return false;
    };

    // create object to keep track of used coordinates
    const usedCoords = word.reduce((acc, letter) => {
      acc[letter] = [];
      return acc;
    }, {});

    return place(word, x, y, usedCoords);
  }

  /**
   * Shuffles an array
   * @param {[]} arr 
   * @returns A copy of the shuffled array
   */
  _shuffle(arr) {
    // Fisher-Yates shuffle
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Converts the board to a JSON string
   * @param {Board} board The board to convert to JSON
   * @returns The JSON string of the board { board: [[String]], placedWords: [String]}
   */
  static toJSON(board) {
    return JSON.stringify({board: board.board, placedWords: board.placedWords});
  }

  /**
   * Prints the board to the console
   */
  print() {
    this.board.forEach((row) => {
      row.forEach((tile) => {
        process.stdout.write(tile + " ");
      });
      process.stdout.write("\n");
    });
    console.log(`# of words: ${this.placedWords.length}`);
    console.log(`Words placed: ${this.placedWords.join(", ")}`);
  }
}

export default Board;