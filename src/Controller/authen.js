const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');


// Middleware setup - to be added to server.js
const setupAuth = (app) => {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Parse JSON payloads
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Make user data available to all templates
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });
};

// Utility function to create database connection
const createConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
};

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Login route
router.get('/login', (req, res) => {
  // If already logged in, redirect to home
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login');
});

// Login form submission
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.render('login', { error: 'Username and password are required' });
    }
    
    const connection = await createConnection();
    
    // Find user in database
    const [users] = await connection.execute(
      'SELECT * FROM Users WHERE userName = ?', 
      [username]
    );
    
    await connection.end();
    
    if (users.length === 0) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    
    const user = users[0];
    
    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.userPassword);
    
    if (!passwordMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    
    // Store user in session (excluding password)
    req.session.user = {
      id: user.userID,
      username: user.userName
    };
    
    // Redirect to home page after successful login
    res.redirect('/');
    
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'An error occurred during login' });
  }
});

// Register route
router.get('/register', (req, res) => {
  // If already logged in, redirect to home
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('register');
});

// Register form submission
router.post('/register', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    
    // Validate input
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
    
    if (password.length < 6) {
      return res.render('register', { 
        error: 'Password must be at least 6 characters',
        username
      });
    }
    
    const connection = await createConnection();
    
    // Check if username already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM Users WHERE userName = ?', 
      [username]
    );
    
    if (existingUsers.length > 0) {
      await connection.end();
      return res.render('register', { 
        error: 'Username already exists',
        username
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const [result] = await connection.execute(
      'INSERT INTO Users (userName, userPassword) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    await connection.end();
    
    // Auto-login after registration
    req.session.user = {
      id: result.insertId,
      username: username
    };
    
    res.redirect('/');
    
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { 
      error: 'An error occurred during registration',
      username: req.body.username
    });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

// Export router and middleware
module.exports = {
  router,
  setupAuth,
  isAuthenticated
};