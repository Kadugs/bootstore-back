import connection from '../database/database.js';

async function getProductsRatings (req, res) {
    try {
        const result = await connection.query("SELECT ratings.rating, sales.product_id FROM ratings JOIN sales ON ratings.sale_id = sales.id;");

        const ratings = [];

        let separatedRatings = result.rows;
        while (separatedRatings.length > 0) {
            const id = separatedRatings[0].product_id;
            const productRatings = separatedRatings.filter((rating) => rating.product_id === id);
            const averageRating = productRatings.map((item) => item.rating).reduce((a, b) => a + b, 0) / productRatings.length;

            ratings.push({
                productId: id,
                average: averageRating,
                quantity: productRatings.length,
            });
            separatedRatings = separatedRatings.filter((rating) => rating.product_id !== id);
        }

        res.status(200).send(ratings);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    getProductsRatings,
}