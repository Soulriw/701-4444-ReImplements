require('dotenv').config();
const mysql = require('mysql2/promise');

class deleteBook {
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

    // Delete a book by bookID
    async deleteBookByID(bookID) {
        try {
            const connection = await this.getConnection();
            const query = 'DELETE FROM Books WHERE bookID = ?';
            const [result] = await connection.query(query, [bookID]);
            await connection.end();

            if (result.affectedRows > 0) {
                console.log(`Book with ID ${bookID} deleted successfully.`);
                return true;
            } else {
                console.log(`No book found with ID ${bookID}.`);
                return false;
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    }
}

const dbDelete = new deleteBook();

dbDelete.deleteBookByID(113)
    .then(() => console.log('Operation completed'))
    .catch(error => console.error('Operation failed:', error));
