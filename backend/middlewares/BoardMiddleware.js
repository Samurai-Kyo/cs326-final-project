export function boardHandler(req, res, next) {
    const { size, category } = req.body;
    if (!size || !category) {
        return res.status(400).json({ error: 'Missing size or category.' });
    }
    if (isNaN(size) || isNaN(category)) {
        return res.status(400).json({ error: 'Invalid size or category.' });
    }
    next();
}