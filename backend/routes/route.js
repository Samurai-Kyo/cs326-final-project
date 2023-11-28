import { Router } from "express";

const router = Router();

// TODO: routes here

router.get('/', (req, res) => {
    res.send('Hello World');
});

export default router;