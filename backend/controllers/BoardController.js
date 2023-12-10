import DB from "../services/DBService.js";
import Board from "../models/Board.js";

/**
 * Gets a board from the database.
 * @param {http.ClientRequest} req The request object. 
 * @param {http.ServerResponse} res The response object.
 */
async function getBoard(req, res) {
  try{
    const { size, category } = req.body;
    console.log(size, category);
    const db = new DB();
    await db.connect();
    const words = await db.getWordsByCategory(category);
    await db.disconnect();
    if (words.length === 0) {
        throw new Error('No words found for category.');
    }
    const board = new Board(words, size);
    const jsonBoard = Board.toJSON(board);
    res.status(200).send(jsonBoard);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal server error.', message: error.message });
  }
}

export { getBoard };