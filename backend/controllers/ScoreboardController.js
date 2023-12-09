import DB from "../services/DBService.js";

async function postScore(req, res) {
    try {
        const { name, score, category_id, board_size } = req.body;
        if (!name || !score || !category_id || !board_size) {
            throw new Error("Missing data");
        }
        const db = new DB();
        db.connect();
        const result = await db.addScore(name, score, category_id, board_size);
        db.disconnect();
        if (!result) {
            throw new Error("Could not add score");
        }
        res.status(201).send({ message: "Score added", result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export { postScore };