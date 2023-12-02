class Game{
    constructor(board, categories) {
        this.board = board.board;
        this.category = categories.currentCategory;
        this.words = board.words;
        console.log(this.words);
        this.size = board.size;
        this.score = 0;
    }
}

export default Game;