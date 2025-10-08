require('dotenv').config();
const mysql = require('mysql2/promise');

class DeleteCategorise {
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

    // Delete a single category by ID
    async deleteCategoryById(categoryId) {
        try {
            const connection = await this.getConnection();
            const query = 'DELETE FROM Categories WHERE categoryID = ?';
            const [result] = await connection.execute(query, [categoryId]);
            await connection.end();

            if (result.affectedRows > 0) {
                console.log(`Deleted category with ID ${categoryId}`);
                return true;
            } else {
                console.log(`No category found with ID ${categoryId}`);
                return false;
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
}

// Example usage:
const dbCategorise = new DeleteCategorise();
const categoryIdToDelete = 6;

dbCategorise.deleteCategoryById(categoryIdToDelete)
    .then(() => console.log('Category deleted successfully'))
    .catch(error => console.error('Failed to delete category:', error));
