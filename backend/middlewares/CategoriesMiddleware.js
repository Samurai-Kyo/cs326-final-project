export function categoryHandler(req, res, next) {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "No category id provided." });
        return;
    }
    next();
}