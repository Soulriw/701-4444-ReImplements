require('dotenv').config();
const mysql = require('mysql2/promise');

class deleteCategorise {
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

    // Delete all books in the Book table
    async deleteAllCategorise() {
        try {
            const connection = await this.getConnection();
            const query = 'DELETE FROM Categories'; // Delete all categorise in table
            const [result] = await connection.query(query);
            await connection.end();

            console.log(`Deleted ${result.affectedRows} categorise from the database.`);
            return true;
        } catch (error) {
            console.error('Error deleting all categorise:', error);
            throw error;
        }
    }
}

// Example usage:
const dbCategorise = new deleteCategorise();

dbCategorise.deleteAllCategorise()
    .then(() => console.log('All categorise deleted successfully'))
    .catch(error => console.error('Failed to delete all categorise:', error));
