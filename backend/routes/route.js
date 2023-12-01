import { Router } from "express";
import { boardHandler } from "../middlewares/BoardMiddleware.js";
import { getBoard } from "../controllers/BoardController.js";

const router = Router();

// TODO: routes here
router.get('/board', boardHandler, getBoard);

export default router;