// ----------------------
// DEPENDENCIES AND SETUP
// ----------------------
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

require('dotenv').config();

// Initialize Express app
const app = express();

// ----------------------
// MIDDLEWARE CONFIGURATION
// ----------------------
// Configure middleware (only once)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'temporary-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../src/View/ejs'));

// Serve static files with caching
app.use(express.static(path.join(__dirname, '../..'), {
  maxAge: '1d' // Cache static assets for 1 day
}));

// ----------------------
// DATABASE CONNECTION
// ----------------------
// Create a single connection pool to be reused
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20, // Increased from 10
  queueLimit: 0
});

console.log('Database connection pool created');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

// ----------------------
// CACHING CONFIGURATION
// ----------------------
// Global caches
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const caches = {
  categories: { data: [], timestamp: 0 },
  promotionBooks: { data: [], timestamp: 0 },
  books: { data: [], timestamp: 0 }
};

// Helper function to get cached data or fetch new data
async function getCachedData(cacheName, query, params = []) {
  const now = Date.now();
  const cache = caches[cacheName];

  // Use cached data if it's still fresh
  if (cache && cache.data.length > 0 && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  // Cache expired or empty, fetch fresh data
  const [rows] = await pool.execute(query, params);

  // Update cache
  if (cache) {
    cache.data = rows;
    cache.timestamp = now;
  }

  return rows;
}

// ----------------------
// GLOBAL MIDDLEWARE
// ----------------------
// Fetch and cache categories for the navbar
async function fetchCategories(req, res, next) {
  try {
    const now = Date.now();

    // Use cached data if it's still fresh
    if (caches.categories.data.length > 0 && now - caches.categories.timestamp < CACHE_TTL) {
      res.locals.categories = caches.categories.data;
      return next();
    }

    // Cache expired or empty, fetch fresh data
    const [rows] = await pool.execute('SELECT * FROM Categories ORDER BY categoryID ASC');

    // Update cache
    caches.categories.data = rows;
    caches.categories.timestamp = now;

    // Store category information in res.locals
    res.locals.categories = rows;
    next();
  } catch (error) {
    console.error('Error fetching categories for navbar:', error);
    res.locals.categories = [];
    next();
  }
}

// Use this middleware for every request
app.use(fetchCategories);

// Make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ----------------------
// AUTHENTICATION MIDDLEWARE
// ----------------------
// Auth middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.redirect('/login');
};

// For making the truncateUsername function available to all EJS templates
app.locals.truncateUsername = function (username, maxLength = 9) {
  if (username.length <= maxLength) {
    return username;
  }
  return username.substring(0, maxLength) + '..';
};

// ----------------------
// AUTHENTICATION ROUTES
// ----------------------
app.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.render('login', { error: 'Username and password are required' });
    }

    // First, check if it's an admin login
    const [admins] = await pool.execute(
      'SELECT * FROM Admins WHERE adminName = ?',
      [username]
    );

    // If admin credentials match
    if (admins.length > 0) {
      const admin = admins[0];

      // Check admin password
      if (admin.adminPassword === password) {
        // Store admin info in session
        req.session.user = {
          id: admin.adminID,
          username: admin.adminName,
          isAdmin: true
        };

        console.log('Admin session created:', {
          sessionId: req.sessionID,
          admin: req.session.user,
          cookie: req.session.cookie
        });

        return res.redirect('/categoryManagement');
      }
    }

    const [users] = await pool.execute(
      'SELECT * FROM Users WHERE userName = ?',
      [username]
    );

    if (users.length === 0) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    //check user login
    const user = users[0];

    // Plain text password comparison
    const passwordMatch = user.userPassword === password;

    if (!passwordMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    req.session.user = {
      id: user.userID,
      username: user.userName,
      isAdmin: false
    };

    console.log('User Login:', {
      user: req.session.user,
    });

    res.redirect('/');

  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'An error occurred during login' });
  }
});

//Register
app.get('/register', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  res.render('register', { error: null, username: '' });
});

app.post('/register', async (req, res) => {
  try {
    console.log('Register attempt:', req.body);
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!username || !password) {
      return res.render('register', {
        error: 'Username and password are required',
        username
      });
    }

    if (password !== confirmPassword) {
      return res.render('register', {
        error: 'Passwords do not match',
        username
      });
    }

    const [existingUsers] = await pool.execute(
      'SELECT * FROM Users WHERE userName = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.render('register', {
        error: 'Username already exists',
        username
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO Users (userName, userPassword) VALUES (?, ?)',
      [username, password]
    );

    req.session.user = {
      id: result.insertId,
      username: username
    };

    res.redirect('/');

  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', {
      error: 'An error occurred during registration',
      username: req.body.username || ''
    });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// ----------------------
// USER PAGE ROUTES
// ----------------------
// Root route - serve the home.ejs file
app.get('/', isAuthenticated, async (req, res) => {
  try {
    // Get promotion books from cache or database
    const promotionBooks = await getCachedData(
      'promotionBooks',
      `SELECT pb.*, b.bookDescription 
       FROM PromotionsBook pb
       JOIN Books b ON pb.bookID = b.bookID
       ORDER BY pb.proBookID ASC`
    );

    // Calculate discount percentages
    const processedBooks = promotionBooks.map(book => {
      const price = Number(book.price);
      const proPrice = Number(book.proPrice);
      return {
        ...book,
        price,
        proPrice,
        discountPercentage: Math.round((1 - (proPrice / price)) * 100)
      };
    });

    res.render('home', {
      promotionBooks: processedBooks,
      itemsPerPage: 5
    });
  } catch (error) {
    console.error('Error fetching promotion books for homepage:', error);
    res.render('home', {
      promotionBooks: [],
      itemsPerPage: 5
    });
  }
});

app.get('/allProduct', isAuthenticated, (req, res) => {
  res.render('allProduct');
});

app.get('/searchPage', isAuthenticated, (req, res) => {
  res.render('searchPage');
});

// Enhanced product detail endpoint that fetches book, promotion, and cart status in parallel
app.get('/productDetail', isAuthenticated, async (req, res) => {
  try {
    const bookId = req.query.id;

    if (!bookId) {
      console.log('Book ID missing in request');
      return res.status(400).send('Book ID is required');
    }

    // Use Promise.all to run queries in parallel
    const [bookResults, cartResults] = await Promise.all([
      // Book details query
      pool.execute('SELECT * FROM Books WHERE bookID = ?', [bookId]),
      // Cart status query
      pool.execute('SELECT * FROM Carts WHERE cartBookID = ?', [bookId])
    ]);

    const [bookRows] = bookResults;
    const [cartRows] = cartResults;

    if (bookRows.length === 0) {
      return res.status(404).send('Book not found');
    }

    const book = bookRows[0];

    // Get promotion books from cache
    const promotions = await getCachedData(
      'promotionBooks',
      'SELECT * FROM PromotionsBook'
    );

    // Find if this book has a promotion
    const promotionInfo = promotions.find(promo =>
      promo.bookID === book.bookID ||
      parseInt(promo.bookID) === parseInt(book.bookID)
    );

    // Add promotion data directly to the book object
    if (promotionInfo) {
      book.proPrice = promotionInfo.proPrice;
      book.hasDiscount = parseFloat(promotionInfo.proPrice) < parseFloat(book.price);
      book.discountPercentage = Math.round((1 - promotionInfo.proPrice / book.price) * 100);
    } else {
      book.proPrice = book.price;
      book.hasDiscount = false;
      book.discountPercentage = 0;
    }

    // Add cart status info to the book object
    book.inCart = cartRows.length > 0;
    if (book.inCart) {
      book.cartInfo = cartRows[0];
    }

    // Render the product detail page with the enhanced book data
    res.render('productDetail', {
      book,
      pageTitle: book.bookName,
      allPromotions: promotions
    });
  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Route for category page
app.get('/category/:id', isAuthenticated, (req, res) => {
  res.render('categoryPage', { categoryId: req.params.id });
});

// Route for cart page
app.get('/cart', isAuthenticated, async (req, res) => {
  try {
    // Fetch all cart items
    const [cartItems] = await pool.execute('SELECT * FROM Carts');

    // Fetch promotion books directly from cache
    const promotionBooks = await getCachedData(
      'promotionBooks',
      'SELECT * FROM PromotionsBook'
    );

    // Update cart items with promotion information ONLY if they exist in PromotionsBook
    cartItems.forEach(item => {
      // First reset any existing promotion data to ensure we're starting fresh
      item.isPromotionBook = false;

      // Check if this book exists in the PromotionsBook table
      const promotionInfo = promotionBooks.find(promo =>
        String(promo.bookID) === String(item.cartBookID)
      );

      if (promotionInfo) {
        // This book exists in the PromotionsBook table
        item.isPromotionBook = true;
        item.proPrice = promotionInfo.proPrice;
        item.hasDiscount = parseFloat(promotionInfo.proPrice) < parseFloat(item.price);

        // Calculate discount percentage for UI
        if (item.hasDiscount) {
          item.discountPercentage = Math.round((1 - (promotionInfo.proPrice / item.price)) * 100);
        }
      } else {
        // Not a promotion book, use regular price
        item.proPrice = item.price;
        item.hasDiscount = false;
      }
    });

    res.render('cart', { cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.render('cart', { cartItems: [] });
  }
});

// Route for contact page
app.get('/contact', isAuthenticated, (req, res) => {
  res.render('contact');
});

// ----------------------
// ADMIN PAGE ROUTES
// ----------------------
app.get('/categoryManagement', isAdmin, (req, res) => {
  res.render('categoryManagement');
});

app.get('/productManagement', isAdmin, (req, res) => {
  res.render('productManagement');
});

app.get('/history', isAdmin, (req, res) => {
  res.render('history');
});

// ----------------------
// API ENDPOINTS - BOOKS
// ----------------------
// API endpoint to fetch all books
app.get('/api/allBooks', async (req, res) => {
  try {
    const books = await getCachedData(
      'books',
      'SELECT * FROM Books ORDER BY bookID ASC'
    );

    res.json(books);
  } catch (error) {
    console.error('Error fetching all books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// API endpoint to fetch books by category
app.get('/api/category/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const [rows] = await pool.execute(
      'SELECT * FROM Books WHERE categoryID = ? ORDER BY bookID ASC',
      [categoryId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// API endpoint to fetch all books
app.get('/books', async (req, res) => {
  try {
    const books = await getCachedData(
      'books',
      'SELECT * FROM Books'
    );

    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Endpoint to add a new book
app.post('/api/books', async (req, res) => {
  try {
    const { bookName, categoryID, bookDescription, price, proPrice, isPromotionBook } = req.body;

    // Validate input
    if (!bookName || bookName.length < 3) {
      return res.status(400).json({ error: 'Book name must be at least 3 characters long' });
    }

    if (!categoryID) {
      return res.status(400).json({ error: 'Category is required' });
    }

    if (!bookDescription || bookDescription.length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters long' });
    }

    if (!price || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Get the category name
      const [categoryRows] = await connection.execute(
        'SELECT categoryName FROM Categories WHERE categoryID = ?',
        [categoryID]
      );

      if (categoryRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Category not found' });
      }

      const categoryName = categoryRows[0].categoryName;

      // Get the next available bookID for this category
      const [maxIDRow] = await connection.execute(
        'SELECT MAX(bookID) as maxID FROM Books WHERE categoryID = ?',
        [categoryID]
      );

      let nextBookID;

      if (maxIDRow[0].maxID) {
        // If there are existing books in this category, increment the ID
        nextBookID = maxIDRow[0].maxID + 1;
      } else {
        // If no books exist in this category, start with categoryID * 100 + 1
        nextBookID = categoryID * 100 + 1;
      }

      // Insert the new book
      const [result] = await connection.execute(
        `INSERT INTO Books (bookID, bookName, categoryID, categoryName, bookDescription, price, proPrice)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          nextBookID,
          bookName,
          categoryID,
          categoryName,
          bookDescription,
          price,
          proPrice || null
        ]
      );

      // If it's a promotion book, add to PromotionsBook
      if (isPromotionBook === 'true' && proPrice) {
        await connection.execute(
          `INSERT INTO PromotionsBook (bookID, bookName, categoryID, categoryName, bookDescription, price, proPrice)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            nextBookID,
            bookName,
            categoryID,
            categoryName,
            bookDescription,
            price,
            proPrice
          ]
        );
      }

      await connection.commit();

      // Invalidate caches
      caches.books.timestamp = 0;
      if (isPromotionBook === 'true') {
        caches.promotionBooks.timestamp = 0;
      }

      res.status(201).json({
        success: true,
        bookID: nextBookID,
        message: 'Book added successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const bookID = req.params.id;
    const { bookName, categoryID, bookDescription, price, proPrice, isPromotionBook } = req.body;

    if (!bookName || !categoryID || !price) {
      return res.status(400).json({ error: 'Book name, category, and price are required' });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Get the category name
      const [categoryRows] = await connection.execute(
        'SELECT categoryName FROM Categories WHERE categoryID = ?',
        [categoryID]
      );

      if (categoryRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Category not found' });
      }

      const categoryName = categoryRows[0].categoryName;

      // Update the book
      const [result] = await connection.execute(
        `UPDATE Books 
         SET bookName = ?, categoryID = ?, categoryName = ?, bookDescription = ?, 
             price = ?, proPrice = ?
         WHERE bookID = ?`,
        [
          bookName,
          categoryID,
          categoryName,
          bookDescription || '',
          price,
          proPrice,
          bookID
        ]
      );

      // Check if book exists in promotions and update it if necessary
      const [promoCheck] = await connection.execute(
        'SELECT * FROM PromotionsBook WHERE bookID = ?',
        [bookID]
      );

      if (promoCheck.length > 0 && isPromotionBook === 'true' && proPrice) {
        // Book exists in promotions, update it
        await connection.execute(
          `UPDATE PromotionsBook 
           SET bookName = ?, categoryID = ?, categoryName = ?, bookDescription = ?, 
               price = ?, proPrice = ?
           WHERE bookID = ?`,
          [
            bookName,
            categoryID,
            categoryName,
            bookDescription || '',
            price,
            proPrice,
            bookID
          ]
        );
      } else if (promoCheck.length === 0 && isPromotionBook === 'true' && proPrice) {
        // Book doesn't exist in promotions but has a promo price, add it
        await connection.execute(
          `INSERT INTO PromotionsBook 
           (bookID, bookName, categoryID, categoryName, bookDescription, price, proPrice)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            bookID,
            bookName,
            categoryID,
            categoryName,
            bookDescription || '',
            price,
            proPrice
          ]
        );
      } else if (promoCheck.length > 0 && isPromotionBook === 'false') {
        // Book exists in promotions but doesn't have a promo price anymore, remove it
        await connection.execute(
          'DELETE FROM PromotionsBook WHERE bookID = ?',
          [bookID]
        );
      }

      await connection.commit();

      // Invalidate caches
      caches.books.timestamp = 0;
      caches.promotionBooks.timestamp = 0;

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json({
        success: true,
        message: 'Book updated successfully'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Endpoint to delete a book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookID = req.params.id;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Delete from PromotionsBook if it exists there
      await connection.execute(
        'DELETE FROM PromotionsBook WHERE bookID = ?',
        [bookID]
      );

      // Delete the book from Books table
      const [result] = await connection.execute(
        'DELETE FROM Books WHERE bookID = ?',
        [bookID]
      );

      await connection.commit();

      // Invalidate caches
      caches.books.timestamp = 0;
      caches.promotionBooks.timestamp = 0;

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// ----------------------
// API ENDPOINTS - CATEGORIES
// ----------------------
// API endpoint to fetch category information
app.get('/api/categoryInfo/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const [rows] = await pool.execute(
      'SELECT * FROM Categories WHERE categoryID = ?',
      [categoryId]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error fetching category information:', error);
    res.status(500).json({ error: 'Failed to fetch category information' });
  }
});

// Endpoint to fetch all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCachedData(
      'categories',
      'SELECT * FROM Categories ORDER BY categoryID ASC'
    );


    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

//For Category Management
// Endpoint to fetch all categories sorted by name
app.get('/api/categories/sorted-by-name', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Get all categories sorted by name
    const [rows] = await connection.execute('SELECT * FROM Categories ORDER BY categoryName ASC');
    await connection.end();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// add Endpoint for add Category
app.post('/api/categories', isAdmin, async (req, res) => {

  try {
    const { categoryName } = req.body;


    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'INSERT INTO Categories (categoryName) VALUES (?)',
        [categoryName.trim()]
      );

      await connection.commit();

      // Invalidate categories cache
      caches.categories.timestamp = 0;

      res.status(201).json({
        success: true,
        categoryID: result.insertId,
        message: 'Category added successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// Endpoint for edit Category
app.put('/api/categories/:id', isAdmin, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryName } = req.body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Update category name
      const [result] = await connection.execute(
        'UPDATE Categories SET categoryName = ? WHERE categoryID = ?',
        [categoryName.trim(), categoryId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Category not found' });
      }

      // Update category name in Books table
      await connection.execute(
        'UPDATE Books SET categoryName = ? WHERE categoryID = ?',
        [categoryName.trim(), categoryId]
      );

      // Update category name in PromotionsBook table
      await connection.execute(
        'UPDATE PromotionsBook SET categoryName = ? WHERE categoryID = ?',
        [categoryName.trim(), categoryId]
      );

      await connection.commit();

      // Invalidate all caches
      caches.categories.timestamp = 0;
      caches.books.timestamp = 0;
      caches.promotionBooks.timestamp = 0;

      res.json({
        success: true,
        message: 'Category updated successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Endpoint for delete Category
app.delete('/api/categories/:id', isAdmin, async (req, res) => {
  try {
    const categoryId = req.params.id;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Delete the category
      const [result] = await connection.execute(
        'DELETE FROM Categories WHERE categoryID = ?',
        [categoryId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Category not found' });
      }

      await connection.commit();

      // Invalidate categories cache
      caches.categories.timestamp = 0;

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ----------------------
// API ENDPOINTS - PROMOTIONS
// ----------------------
// API endpoint to fetch promotion books
app.get('/api/promotionBooks', async (req, res) => {
  try {
    const promotionBooks = await getCachedData(
      'promotionBooks',
      'SELECT * FROM PromotionsBook'
    );

    res.json(promotionBooks);
  } catch (error) {
    console.error('Error fetching promotion books:', error);
    res.status(500).json({ error: 'Failed to fetch promotion books' });
  }
});

// ----------------------
// API ENDPOINTS - CART
// ----------------------
// API endpoint to fetch cart items
app.get('/carts', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Carts');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching carts:', error);
    res.status(500).json({ error: 'Failed to fetch carts' });
  }
});

// API endpoint to add item to cart
app.post('/api/cart/add', isAuthenticated, async (req, res) => {
  try {
    console.log('Received add to cart request:', req.body);
    const { bookID, quantity, enchantment } = req.body;

    if (!bookID) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    // Use a connection from the pool
    const connection = await pool.getConnection();

    try {
      // First check if the book is already in the cart
      const [existingItems] = await connection.execute(
        'SELECT * FROM Carts WHERE cartBookID = ?',
        [bookID]
      );

      if (existingItems.length > 0) {
        // Item already exists in cart
        console.log('Item already exists in cart:', existingItems[0].cartID);
        return res.json({
          success: true,
          message: 'Item is already in your cart',
          cartID: existingItems[0].cartID,
          alreadyInCart: true
        });
      }

      // Begin transaction for data consistency
      await connection.beginTransaction();

      // Get the book details from the Books table
      console.log('Fetching book details for ID:', bookID);
      const [bookRows] = await connection.execute(
        'SELECT * FROM Books WHERE bookID = ?',
        [bookID]
      );

      if (bookRows.length === 0) {
        await connection.rollback();
        console.log('Book not found with ID:', bookID);
        return res.status(404).json({ error: 'Book not found' });
      }

      const book = bookRows[0];
      console.log('Book found:', book.bookName);

      // Get category name if category ID exists
      let categoryName = '';
      if (book.categoryID) {
        console.log('Fetching category name for ID:', book.categoryID);
        const [categoryRows] = await connection.execute(
          'SELECT categoryName FROM Categories WHERE categoryID = ?',
          [book.categoryID]
        );

        if (categoryRows.length > 0) {
          categoryName = categoryRows[0].categoryName;
          console.log('Category name found:', categoryName);
        } else {
          console.log('Category not found for ID:', book.categoryID);
        }
      }

      // Add a unique constraint check before inserting
      // This helps prevent duplicates in case of race conditions
      const [checkResult] = await connection.execute(
        'SELECT COUNT(*) as count FROM Carts WHERE cartBookID = ?',
        [bookID]
      );

      if (checkResult[0].count > 0) {
        await connection.rollback();
        console.log('Race condition detected! Item was added by another request');
        return res.json({
          success: true,
          message: 'Item is already in your cart',
          alreadyInCart: true
        });
      }

      // Insert into Carts table
      console.log('Inserting into Carts table with data:', {
        cartBookID: book.bookID,
        bookName: book.bookName,
        categoryID: book.categoryID,
        categoryName,
        quantity: quantity || 1,
        enchantment: enchantment || ''
      });

      const [result] = await connection.execute(
        `INSERT INTO Carts (cartBookID, bookName, categoryID, categoryName, 
         bookDescription, price, proPrice, quantity, enchantment) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          book.bookID,
          book.bookName,
          book.categoryID || 1,
          categoryName || 'Uncategorized',
          book.bookDescription || '',
          book.price,
          book.proPrice || book.price,
          quantity || 1,
          enchantment || ''
        ]
      );

      // Commit the transaction
      await connection.commit();

      console.log('Item added to cart successfully:', {
        cartID: result.insertId,
        affectedRows: result.affectedRows
      });

      res.json({
        success: true,
        message: 'Item added to cart successfully',
        cartID: result.insertId
      });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      // Always release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error('Detailed error adding item to cart:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to add item to cart: ' + error.message });
  }
});

app.get('/api/cart/count', async (req, res) => {
  try {
    // Count total items in cart (counting quantities)
    const [result] = await pool.execute('SELECT SUM(quantity) as totalItems FROM Carts');

    const count = result[0].totalItems || 0;

    res.json({ count: parseInt(count) });
  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({ error: 'Failed to get cart count', count: 0 });
  }
});

// API endpoint to remove item from cart
app.delete('/api/cart/remove/:id', isAuthenticated, async (req, res) => {
  try {
    const cartId = req.params.id;

    // Remove the item from the cart
    const [result] = await pool.execute(
      'DELETE FROM Carts WHERE cartID = ?',
      [cartId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// API endpoint for checkout
app.post('/api/checkout', isAuthenticated, async (req, res) => {
  try {
    const { cartIds } = req.body;

    if (!cartIds || !Array.isArray(cartIds) || cartIds.length === 0) {
      return res.status(400).json({ error: 'No items selected for checkout' });
    }

    const connection = await pool.getConnection();

    // Begin transaction
    await connection.beginTransaction();

    try {
      // Get all selected cart items
      const [cartItems] = await connection.execute(
        `SELECT * FROM Carts WHERE cartID IN (${cartIds.map(() => '?').join(',')})`,
        cartIds
      );

      // Insert items into history
      for (const item of cartItems) {
        await connection.execute(
          `INSERT INTO Historys (bookID, bookName, categoryID, categoryName, 
           sellPrice, quantity, enchantment) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            item.cartBookID,
            item.bookName,
            item.categoryID,
            item.categoryName,
            item.proPrice || item.price,
            item.quantity,
            item.enchantment || ''
          ]
        );
      }

      // Remove items from cart
      await connection.execute(
        `DELETE FROM Carts WHERE cartID IN (${cartIds.map(() => '?').join(',')})`,
        cartIds
      );

      // Commit transaction
      await connection.commit();

      res.status(200).json({ success: true, message: 'Checkout completed successfully' });
    } catch (error) {
      // Rollback transaction if there's an error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Failed to complete checkout' });
  }
});

// ----------------------
// API ENDPOINTS - SEARCH
// ----------------------
// API endpoint for searching books
app.get('/api/search', async (req, res) => {
  try {
    const searchTerm = req.query.term;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    // Use the connection pool instead of creating a new connection
    const [rows] = await pool.execute(
      `SELECT * FROM Books 
       WHERE bookName LIKE ? 
       OR bookDescription LIKE ?
       ORDER BY bookName ASC`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

// ----------------------
// API ENDPOINTS - HISTORY
// ----------------------
// API endpoint to fetch history data
app.get('/api/history', isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Historys ORDER BY historyID DESC');
    console.log('History data retrieved:', rows.length, 'records');

    res.json(rows);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ----------------------
// EMAIL HANDLER
// ----------------------
app.use(require('./email-handler'));

// ----------------------
// START SERVER
// ----------------------
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`View the website at http://localhost:${PORT}`);
});