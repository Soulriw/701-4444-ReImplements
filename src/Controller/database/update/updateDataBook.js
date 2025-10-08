require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateBook(bookID, updatedData) {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const fields = Object.keys(updatedData).map(field => `${field} = ?`).join(', ');
        const values = Object.values(updatedData);

        if (fields.length === 0) {
            console.log('No data provided to update.');
            return;
        }

        const query = `UPDATE Books SET ${fields} WHERE bookID = ?`;

    
        const [result] = await connection.query(query, [...values, bookID]);

        if (result.affectedRows > 0) {
            console.log(`Successfully updated book ID: ${bookID}`);
        } else {
            console.log(`No book found with ID: ${bookID}`);
        }
    } catch (error) {
        console.error(`Error updating book ID ${bookID}:`, error);
    } finally {
        if (connection) await connection.end();
    }
}

const bookIDToUpdate = 512; 
const updatedBookData = {
    bookName: 'kk',
    categoryID: 0,
    categoryName: '',
    bookDescription: '',
    price: 0.00,
    proPrice: 0.00,
    enchantment: '',
    
};

updateBook(bookIDToUpdate, updatedBookData).then(() => console.log('Book update completed!'));
