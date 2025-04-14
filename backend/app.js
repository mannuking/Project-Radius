const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { sequelize, testConnection } = require('./config/database');
const { initializeAssociations } = require('./models');

// Load env vars
dotenv.config();

// Initialize model associations
initializeAssociations();

// Test database connection and sync models
const initializeDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true }); // This will create/update tables
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

initializeDatabase();

// Import routes
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 
