import DB from "../services/DBService.js";

/**
 * Get all categories from the database.
 * @param {http.ClientRequest} req 
 * @param {http.ServerResponse} res 
 */
async function getCategories(req,res){
    try {
        const db = new DB();
        db.connect();
        const categories = await db.getCategories();
        db.disconnect();
        if (categories.length === 0) {
            throw new Error('No categories found.');
        }
        res.status(200).send({categories: categories});
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error.', message: error.message });
    }
}

export { getCategories };