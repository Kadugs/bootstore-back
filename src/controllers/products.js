import connection from '../database/database.js';

async function getProducts (req, res) {
    const searchQuery = req.query.name;

    try {
        let query = "SELECT id, name, value, image FROM products";
        const parametres = [];

        if (searchQuery) {
            query += " WHERE LOWER (name) LIKE LOWER ($1)";
            parametres.push('%' + searchQuery + '%');
        }

        const result = await connection.query(query + ';', parametres);

        const productsList = result.rows;
        res.status(200).send(productsList);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export {
    getProducts,
}