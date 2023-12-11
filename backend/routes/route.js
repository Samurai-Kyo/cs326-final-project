import { Router } from "express";
import { boardHandler } from "../middlewares/BoardMiddleware.js";
import { getBoard } from "../controllers/BoardController.js";
import { getCategories } from "../controllers/CategoriesController.js";
import { postScore, getScores, deleteScore, editScoreName } from "../controllers/ScoreboardController.js";

const router = Router();

router.post('/board', boardHandler, getBoard);
router.get('/categories', getCategories);
router.get('/scoreboard', getScores);
router.post('/scoreboard', postScore);
router.delete('/scoreboard/:id', deleteScore);
router.put('/scoreboard/:id', editScoreName);

export default router;