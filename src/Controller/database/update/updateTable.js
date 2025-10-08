require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateCartIDAutoIncrement() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database.');

        const alterQuery = `
            ALTER TABLE Carts 
            MODIFY cartID INT AUTO_INCREMENT NOT NULL;
        `;

        await connection.execute(alterQuery);
        console.log('cartID column successfully updated to AUTO_INCREMENT.');

    } catch (error) {
        console.error('Error updating cartID to AUTO_INCREMENT:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateCartIDAutoIncrement();
