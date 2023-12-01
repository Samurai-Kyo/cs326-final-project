import Board from "./Board";

class Game {
    /**
     * Creates a game with the given board and user.
     * @param {Board} board The board to use for the game
     * @param {string} user The user to use for the game
     * @param {string} category The category to use for the game
     */
    constructor(board, user, category) {
        this.board = board;
        this.user = user;
        this.category = category;
        this.score = 0;
        this.foundWords = [];
        this.letterScores = {
            A: 10, B: 3, C: 3, D: 6, E: 10, F: 3, G: 4, H: 3, I: 9, J: 1,
            K: 2, L: 5, M: 3, N: 5, O: 8, P: 3, Q: 1, R: 7, S: 7, T: 7,
            U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1
        };
    }

    /**
     * Checks if a word is valid.
     * @param {string} word
     * @returns if the word is valid
     */
    isValidWord(word) {
        return this.board.placedWords.includes(word);
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
     */
    addFoundWord(word) {
        this.foundWords.push(word);
        this.score += this._calculateScore(word);
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
     * Checks if the word has a valid path on the board.
     * @param {string} word The word to check
     * @param {[{x, y}]} path The path of the word
     * @returns A boolean if the word has a valid path
     */
    isValidPath(word, path) {
        if (path.length !== word.length) {
            return false;
        }
        let previousTile = path[0];
        for (let i = 0; i < path.length; i++) {
            // makes the new tile is at most 1 tile away from the previous tile
            if (Math.abs(path[i].x - previousTile.x) > 1 || Math.abs(path[i].y - previousTile.y) > 1) {
                return false;
            }
            // makes sure the tile on board matches the letter in the word
            if (this.board.board[path[i].x][path[i].y] !== word[i]) {
                return false;
            }
            previousTile = path[i];
        }
        return true;
    }

    getScore() {
        return this.score;
    }

    getFoundWords() {
        return this.foundWords;
    }

    getBoard() {
        return this.board;
    }

    getUser() {
        return this.user;
    }

    /**
     * Converts the game to a JSON string
     * @param {Game} game The game to convert to JSON
     * @returns The JSON string of the game
     */
    static toJSON(game) {
        return JSON.stringify({
            board: game.board,
            user: game.user,
            score: game.score,
            foundWords: game.foundWords
        });
    }
}

export default Game;