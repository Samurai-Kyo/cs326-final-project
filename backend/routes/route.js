import { Router } from "express";
import { boardHandler } from "../middlewares/BoardMiddleware.js";
import { categoryHandler } from "../middlewares/CategoriesMiddleware.js";
import { getBoard } from "../controllers/BoardController.js";
import { getCategories } from "../controllers/CategoriesController.js";
import { postScore, getScores } from "../controllers/ScoreboardController.js";

const router = Router();

// TODO: routes here
router.post('/board', boardHandler, getBoard);
router.get('/categories', getCategories);
router.get('/scoreboard', getScores);
router.post('/scoreboard', postScore);

export default router;