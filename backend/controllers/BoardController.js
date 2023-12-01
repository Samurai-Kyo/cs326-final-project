import db from "../services/DBService.js";
import { Board } from "../models/Board.js";

export class BoardController {
    async getBoard(req, res) {
        const { size, category } = req.body;
        const board = new Board(size, category);
        const result = await db.getBoard(board);
        if (result) {
            return res.status(200).json(result);
        }
        return res.status(400).json({ error: 'Invalid size or category.' });
    }
}

export default new BoardController();