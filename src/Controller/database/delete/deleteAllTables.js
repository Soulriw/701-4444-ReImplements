import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function dropAllTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        await connection.query(`DROP TABLE IF EXISTS Historys`);
        await connection.query(`DROP TABLE IF EXISTS Carts`);
        await connection.query(`DROP TABLE IF EXISTS Sections`);
        await connection.query(`DROP TABLE IF EXISTS PromotionsBook`);
        await connection.query(`DROP TABLE IF EXISTS Books`);
        await connection.query(`DROP TABLE IF EXISTS Admins`);
        await connection.query(`DROP TABLE IF EXISTS Users`);
        await connection.query(`DROP TABLE IF EXISTS Categories`);

        console.log('All tables dropped successfully');

        await connection.end();
    } catch (error) {
        console.error('Error dropping tables:', error);
    }
}

dropAllTables();
