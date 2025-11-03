require('dotenv').config();
const mysql = require('mysql2/promise');

async function addCategories() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const categories = ['Spell', 'Education', 'History', 'Literature', 'General'];

        for (const category of categories) {
            await connection.execute(`
                INSERT INTO Categories (categoryName) VALUES (?)`, 
                [category]
            );
            console.log(`Added book:: ${category} successfully`);
        }

        await connection.end();
    } catch (error) {
        console.error('Error inserting categories:', error);
    }
}

addCategories();
