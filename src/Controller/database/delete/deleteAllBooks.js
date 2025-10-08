require('dotenv').config();
const mysql = require('mysql2/promise');

class deleteAllBooks {
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
    async deleteAllBooks() {
        try {
            const connection = await this.getConnection();
            const query = 'DELETE FROM Book'; // Delete all Book in table
            const [result] = await connection.query(query);
            await connection.end();

            console.log(`Deleted ${result.affectedRows} books from the database.`);
            return true;
        } catch (error) {
            console.error('Error deleting all books:', error);
            throw error;
        }
    }
}

// Example usage:
const dbDelete = new deleteAllBooks();

dbDelete.deleteAllBooks()
    .then(() => console.log('All books deleted successfully'))
    .catch(error => console.error('Failed to delete all books:', error));
