require('dotenv').config();
const mysql = require('mysql2/promise');

async function dropTable(tableName) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        await connection.query(`DROP TABLE IF EXISTS ${tableName}`);
        console.log(`Dropped table: ${tableName}`);

        await connection.end();
    } catch (error) {
        console.error(`Error dropping table ${tableName}:`, error);
    }
}
dropTable("Categories");
