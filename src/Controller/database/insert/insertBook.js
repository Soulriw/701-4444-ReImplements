require('dotenv').config();
const mysql = require('mysql2/promise');

async function addSingleBook(bookData) {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query(
            'SELECT MAX(bookID) AS lastID FROM Books WHERE categoryID = ?',
            [bookData.categoryID]
        );

        let newBookID;
        if (rows[0].lastID) {
            newBookID = rows[0].lastID + 1;
        } else {
            newBookID = bookData.categoryID * 100;
        }

        const query = `
            INSERT INTO Books (bookID, bookName, categoryID, categoryName, bookDescription, price, proPrice)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(query, [
            newBookID,
            bookData.bookName,
            bookData.categoryID,
            bookData.categoryName,
            bookData.bookDescription,
            bookData.price,
            bookData.proPrice
        ]);

        console.log(`Successfully added book: ${bookData.bookName} (ID: ${newBookID})`);
    } catch (error) {
        console.error(`Error adding book ${bookData.bookName}:`, error);
    } finally {
        if (connection) await connection.end();
    }
}

const newBook = {
    bookName: 'kkk',
    categoryID: 1,
    categoryName: 'General',
    bookDescription: 'kkpro',
    price: 19.99,
    proPrice: 15.99
};

addSingleBook(newBook).then(() => console.log('Book insertion completed!'));
