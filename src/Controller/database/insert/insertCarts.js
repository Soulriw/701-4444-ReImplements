require('dotenv').config();
const mysql = require('mysql2/promise');

async function addBooksToCart(cartID, books) {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        for (const { bookID, quantity, enchantment } of books) {
            // Retrieve book information from Books (but don't remove the enchantment)
            const [rows] = await connection.execute(`
                SELECT bookID, bookName, categoryID, categoryName, bookDescription, price, proPrice
                FROM Books
                WHERE bookID = ?`, 
                [bookID]
            );

            if (rows.length === 0) {
                console.log(`Book ID ${bookID} not found, skipping...`);
                continue;
            }

            const book = rows[0];

            // Add information to cart
            await connection.execute(`
                INSERT INTO Carts (cartID, cartBookID, bookName, categoryID, categoryName, bookDescription, price, proPrice, quantity, enchantment) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [cartID, book.bookID, book.bookName, book.categoryID, book.categoryName, book.bookDescription, book.price, book.proPrice, quantity, enchantment]
            );

            console.log(`Added Book ID ${bookID} (x${quantity}) with enchantment: "${enchantment}" to Cart ID ${cartID}`);
        }

        await connection.end();
    } catch (error) {
        console.error('Error inserting books into cart:', error);
    }
}

// 🔹 Example of calling (Add multiple books to Cart ID = 1 with `enchantment`)
addBooksToCart(1, [
    { bookID: 101, quantity: 2, enchantment: "Fire Resistance" },
    { bookID: 102, quantity: 1, enchantment: "Fire Resistance" },
    { bookID: 103, quantity: 3, enchantment: "Speed Boost" },
    { bookID: 999, quantity: 1, enchantment: "Unknown" }
]);
addBooksToCart(2, [
    { bookID: 101, quantity: 2, enchantment: "Fire Resistance" },
    { bookID: 102, quantity: 1, enchantment: "Fire Resistance" },
    { bookID: 103, quantity: 3, enchantment: "Speed Boost" },
    { bookID: 999, quantity: 1, enchantment: "Unknown" }
]);
