//-------- Table Create ---------//
require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        // Create Carts table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Carts (
                cartID INT AUTO_INCREMENT NOT NULL,
                cartBookID INT NOT NULL,
                bookName VARCHAR(255) NOT NULL,
                categoryID INT NOT NULL,
                categoryName VARCHAR(100) NOT NULL,
                bookDescription TEXT,
                price DECIMAL(10,2) NOT NULL,
                proPrice DECIMAL(10,2),
                quantity INT NOT NULL DEFAULT 1,
                enchantment TEXT,
                PRIMARY KEY (cartID, cartBookID),
                FOREIGN KEY (cartBookID) REFERENCES Books(bookID)
                    ON DELETE CASCADE   
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log('Carts table created successfully');


        
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

createTables();
//-------- Table Create End ---------//