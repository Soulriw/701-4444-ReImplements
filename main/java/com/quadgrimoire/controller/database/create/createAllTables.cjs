//--------All Table Create ---------//
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

        // Create Categories table 
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Categories (
                categoryID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                categoryName VARCHAR(100) NOT NULL
            ) ENGINE=InnoDB
        `);
        console.log('Categories table created successfully');

        // Create Users table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Users (
                userID INT AUTO_INCREMENT PRIMARY KEY,
                userName VARCHAR(100) NOT NULL UNIQUE,
                userPassword VARCHAR(255) NOT NULL
            ) ENGINE=InnoDB;
        `);
        console.log('Users table created successfully');

        // Create Admins table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Admins (
                adminID INT AUTO_INCREMENT PRIMARY KEY,
                adminName VARCHAR(100) NOT NULL UNIQUE,
                adminPassword VARCHAR(255) NOT NULL
            ) ENGINE=InnoDB;
        `);
        console.log('Admins table created successfully');

        // Create Books table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Books (
                bookID INT PRIMARY KEY,
                bookName VARCHAR(255) NOT NULL,
                categoryID INT NOT NULL,
                categoryName VARCHAR(100) NOT NULL,
                bookDescription TEXT,
                price DECIMAL(10,2) NOT NULL,
                proPrice DECIMAL(10,2),
                enchantment TEXT,
                FOREIGN KEY (categoryID) REFERENCES Categories(categoryID)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log('Books table created successfully');

        // Create PromotionsBook table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS PromotionsBook (
                proBookID INT AUTO_INCREMENT PRIMARY KEY,
                bookID INT NOT NULL,
                bookName VARCHAR(255) NOT NULL,
                categoryID INT NOT NULL,
                categoryName VARCHAR(100) NOT NULL,
                bookDescription TEXT,
                price DECIMAL(10,2) NOT NULL,
                proPrice DECIMAL(10,2),
                FOREIGN KEY (bookID) REFERENCES Books(bookID)
                    ON DELETE CASCADE   
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log('PromotionsBook table created successfully');
        

        // Create Sections table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Sections (
                sectionID INT AUTO_INCREMENT PRIMARY KEY,
                permission VARCHAR(100) NOT NULL
            ) ENGINE=InnoDB;
        `);
        console.log('Sections table created successfully');

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

        //Create Historys table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Historys (
                historyID INT AUTO_INCREMENT NOT NULL,
                bookID INT NOT NULL,
                bookName VARCHAR(255) NOT NULL,
                categoryID INT NOT NULL,
                categoryName VARCHAR(100) NOT NULL,
                sellPrice DECIMAL(10,2) NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                enchantment TEXT DEFAULT NULL,
                PRIMARY KEY (historyID, bookID),
                FOREIGN KEY (bookID) REFERENCES Books(bookID)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB;
        `);
        console.log('Historys table created successfully');
        
        await connection.end();
        console.log('All tables created successfully');

    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

createTables();
//--------All Table Create End ---------//