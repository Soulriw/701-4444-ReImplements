require('dotenv').config();
const mysql = require('mysql2/promise');

async function deleteCartById(cartID) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // ลบข้อมูลจากตาราง Carts โดยใช้ cartID
        const [result] = await connection.execute(`
            DELETE FROM Carts WHERE cartID = ?`, 
            [cartID]
        );

        await connection.end();

        if (result.affectedRows > 0) {
            console.log(`Deleted cart with ID ${cartID} successfully.`);
        } else {
            console.log(`No cart found with ID ${cartID}. Nothing was deleted.`);
        }
    } catch (error) {
        console.error('Error deleting cart:', error);
    }
}

deleteCartById(2)
    .then(() => console.log('Cart deleted successfully'))
    .catch(error => console.error('Failed to delete cart:', error));
