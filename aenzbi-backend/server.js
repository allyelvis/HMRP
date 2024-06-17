const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const { Client } = require('pg');
const mongoose = require('mongoose');
const multer = require('multer');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
const paypal = require('paypal-rest-sdk');
const config = require('./config/config');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: '*', // Adjust based on your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize databases
const mysqlConnection = mysql.createConnection(config.mysql);
mysqlConnection.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

const pgClient = new Client(config.postgresql);
pgClient.connect(err => {
  if (err) throw err;
  console.log('PostgreSQL connected');
});

mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// PayPal setup
paypal.configure(config.paypal);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token.split(' ')[1], config.secretKey, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};

// Import routes
const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotel');
const restaurantRoutes = require('./routes/restaurant');
const retailRoutes = require('./routes/retail');
const accountingRoutes = require('./routes/accounting');
const salesRoutes = require('./routes/sales');
const productRoutes = require('./routes/product');
const inventoryRoutes = require('./routes/inventory');
const reportRoutes = require('./routes/report');
const userRoutes = require('./routes/user');
const configRoutes = require('./routes/config');

// Use routes
app.use('/auth', authRoutes);
app.use('/hotel', verifyToken, hotelRoutes);
app.use('/restaurant', verifyToken, restaurantRoutes);
app.use('/retail', verifyToken, retailRoutes);
app.use('/accounting', verifyToken, accountingRoutes);
app.use('/sales', verifyToken, salesRoutes);
app.use('/product', verifyToken, productRoutes);
app.use('/inventory', verifyToken, inventoryRoutes);
app.use('/report', verifyToken, reportRoutes);
app.use('/user', verifyToken, userRoutes);
app.use('/config', verifyToken, configRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
