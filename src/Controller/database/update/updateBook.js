require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateBook(bookID, updatedData) {
    if (!bookID || typeof bookID !== 'number') {
        console.error('Invalid bookID provided.');
        return;
    }

    if (!updatedData || typeof updatedData !== 'object') {
        console.error('Invalid updatedData provided.');
        return;
    }

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const query = `
            UPDATE Books 
            SET bookName = ?, categoryID = ?, 
                bookDescription = ?, price = ?, 
                proPrice = ?, enchantment = ?
            WHERE bookID = ?
        `;

        const [result] = await connection.execute(query, [
            updatedData.bookName,
            updatedData.categoryID,
            updatedData.bookDescription,
            updatedData.price,
            updatedData.proPrice,
            updatedData.enchantment,
            bookID
        ]);

        if (result.affectedRows > 0) {
            console.log(`Successfully updated book ID: ${bookID}`);
        } else {
            console.log(`No book found with ID: ${bookID}`);
        }
    } catch (error) {
        console.error(`Error updating book ID ${bookID}:`, error.message);
    } finally {
        if (connection) await connection.end();
    }
}

const bookIDToUpdate = 'bookID'; 
const updatedBookData = {
    bookName: 'Updated Book Name',
    categoryID: 'cateID',
    bookDescription: 'Updated description',
    price: 0.00,
    proPrice: 0.00,
    enchantment: ''
};

updateBook(bookIDToUpdate, updatedBookData)
    .then(() => console.log('✔️ Book update process completed!'));
