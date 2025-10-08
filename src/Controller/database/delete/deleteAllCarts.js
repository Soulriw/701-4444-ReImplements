require('dotenv').config();
const mysql = require('mysql2/promise');

async function deleteAllCarts() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [result] = await connection.execute(`DELETE FROM Carts`);

        await connection.end();

        if (result.affectedRows > 0) {
            console.log(`Deleted all ${result.affectedRows} cart records successfully.`);
        } else {
            console.log(`No carts found. Nothing was deleted.`);
        }
    } catch (error) {
        console.error('Error deleting all carts:', error);
    }
}

deleteAllCarts()
    .then(() => console.log('All carts deleted successfully'))
    .catch(error => console.error('Failed to delete all carts:', error));
