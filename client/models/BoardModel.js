class Board {
    /**
     * Creates a new Board object with uninitialized values and default size of 5.
     */
    constructor() {
        this.board = null;
        this.size = 5;
        this.words = [];
    }

    /**
     * Sets the board.
     * @param {obj} board The board.
     * @param {[string]} words The words on the board.
     */
    setBoard(board, words) {
        this.board = board;
        this.words = words;
    }
}

export default Board;