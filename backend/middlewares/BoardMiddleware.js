/**
 * Checks if the request body contains a size and category.
 * @param {http.ClientRequest} req The request object
 * @param {http.ServerResponse} res The response object
 * @param {()} next The next middleware
 * @returns a 400 response with an error message. Otherwise, calls the next middleware.
 */
export function boardHandler(req, res, next) {
    const { size, category } = req.body;
    console.log(size, category);
    if (!size || !category) {
        console.log('Missing size or category.');
        return res.status(400).json({ error: 'Missing size or category.' });
    }
    if (isNaN(size) || isNaN(category)) {
        console.log('Invalid size or category type.');
        return res.status(400).json({ error: 'Invalid size or category type.' });
    }
    next();
}