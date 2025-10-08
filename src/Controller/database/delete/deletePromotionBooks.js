require('dotenv').config();
const mysql = require('mysql2/promise');

class PromotionsBook {
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

    async deleteBooksFromPromotion(bookIds) {
        try {
            const connection = await this.getConnection();
            const query = `
                DELETE FROM PromotionsBook 
                WHERE bookID IN (${bookIds.map(() => '?').join(',')});
            `;

            const [result] = await connection.execute(query, bookIds);
            await connection.end();

            if (result.affectedRows > 0) {
                console.log(`Deleted ${result.affectedRows} books from PromotionsBook.`);
            } else {
                console.log('No matching books found in PromotionsBook.');
            }
        } catch (error) {
            console.error('Error deleting books from PromotionsBook:', error);
            throw error;
        }
    }
}

const promotionsBook = new PromotionsBook();

const bookIdsToDelete = [309, 311, 404, 411, 510, 101, 102];

promotionsBook.deleteBooksFromPromotion(bookIdsToDelete)
    .then(() => console.log('Selected books deleted from promotion successfully'))
    .catch(error => console.error('Failed to delete selected books from promotion:', error));
