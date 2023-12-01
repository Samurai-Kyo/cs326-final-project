import { Router } from "express";
import { boardHandler } from "../middlewares/BoardMiddleware.js";
import { categoryHandler } from "../middlewares/CategoriesMiddleware.js";
import { getBoard } from "../controllers/BoardController.js";
import { getCategories } from "../controllers/CategoriesController.js";

const router = Router();

// TODO: routes here
router.get('/board', boardHandler, getBoard);
router.get('/categories', getCategories);

export default router;