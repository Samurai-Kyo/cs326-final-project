class Game{
    constructor(board, category) {
        this.board = board.board;
        this.category = category;
        this.words = board.words;
        this.size = board.size;
        this.score = 0;
        this.guessWord = "";
        this.letterCoordsClicked = {};
        this.foundWords = [];
    }
}

export default Game;