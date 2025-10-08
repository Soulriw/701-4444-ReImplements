require('dotenv').config();
const mysql = require('mysql2/promise');

class CategoryManager {
    constructor() {
        this.config = {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        };
    }

    async getConnection() {
        return await mysql.createConnection(this.config);
    }

    async addCategory(categoryName) {
        try {
            const connection = await this.getConnection();
            const query = `INSERT INTO Categories (categoryName) VALUES (?)`;
            const [result] = await connection.execute(query, [categoryName]);
            await connection.end();

            if (result.affectedRows > 0) {
                console.log(`Added category: ${categoryName} successfully`);
                return true;
            } else {
                console.log(`Failed to add category: ${categoryName}`);
                return false;
            }
        } catch (error) {
            console.error('Error inserting category:', error);
            throw error;
        }
    }
}

// Example usage:
const categoryManager = new CategoryManager();
const newCategory = 'kkk';

categoryManager.addCategory(newCategory)
    .then(() => console.log('Category added successfully'))
    .catch(error => console.error('Failed to add category:', error));
