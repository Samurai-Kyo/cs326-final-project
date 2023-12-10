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

async function getScores(req, res) {
    try {
        const db = new DB();
        db.connect();
        const result = await db.getScores();
        db.disconnect();
        if (!result) {
            throw new Error("Could not get scores");
        }
        res.status(200).send({ message: "Scores retrieved", result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function deleteScore(req, res) {
    try{
        const { id } = req.params;
        console.log(id);
        if (!id) {
            throw new Error("Missing data");
        }
        const db = new DB();
        db.connect();
        const result = await db.deleteScore(id);
        db.disconnect();
        if (!result) {
            throw new Error("Could not delete score");
        }
        res.status(200).send({ message: "Score deleted", result });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function editScoreName(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!id || !name) {
            throw new Error("Missing data");
        }
        const db = new DB();
        db.connect();
        const result = await db.editScoreName(id, name);
        db.disconnect();
        if (!result) {
            throw new Error("Could not edit score");
        }
        res.status(200).send({ message: "Score edited", result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export { postScore, getScores, deleteScore, editScoreName };