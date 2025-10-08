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

    async getSelectedBooks(bookIds) {
        try {
            const connection = await this.getConnection();
            const query = `
                SELECT bookID, bookName, categoryID, categoryName, bookDescription, price, proPrice 
                FROM Books 
                WHERE bookID IN (${bookIds.map(() => '?').join(',')});
            `;

            const [rows] = await connection.execute(query, bookIds);
            await connection.end();

            return rows;
        } catch (error) {
            console.error('Error fetching selected books:', error);
            throw error;
        }
    }

    async addSelectedBooksToPromotion(bookIds) {
        try {
            const books = await this.getSelectedBooks(bookIds);

            if (books.length === 0) {
                console.log('No books found for the given IDs.');
                return;
            }

            const connection = await this.getConnection();
            const query = `
                INSERT INTO PromotionsBook (bookID, bookName, categoryID, categoryName, bookDescription, price, proPrice)
                VALUES ${books.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(',')};
            `;

            const values = books.flatMap(book => [
                book.bookID,
                book.bookName,
                book.categoryID,
                book.categoryName,
                book.bookDescription,
                book.price,
                book.proPrice
            ]);

            await connection.execute(query, values);
            await connection.end();

            console.log(`Added ${books.length} books to PromotionsBook successfully.`);
        } catch (error) {
            console.error('Error adding selected books to PromotionsBook:', error);
            throw error;
        }
    }
}

const promotionsBook = new PromotionsBook();

//const bookIdsToAdd = [309, 311, 404, 411, 510]; 
const bookIdsToAdd = [101, 102]; 

promotionsBook.addSelectedBooksToPromotion(bookIdsToAdd)
    .then(() => console.log('Selected books added to promotion successfully'))
    .catch(error => console.error('Failed to add selected books to promotion:', error));
