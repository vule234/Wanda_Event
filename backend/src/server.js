require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { requestIdMiddleware, errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Security Middleware
 */
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

/**
 * Logging Middleware
 */
app.use(morgan('combined'));

/**
 * Request ID Middleware - Attach unique ID to each request
 */
app.use(requestIdMiddleware);

/**
 * Body Parser Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Rate Limiting
 */
app.use('/api', apiLimiter);

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Mercury Wanda API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Routes
 */
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

/**
 * Error Handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎊 Mercury Wanda API Server                        ║
║                                                       ║
║   Status: Running                                     ║
║   Port: ${PORT}                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║   Time: ${new Date().toLocaleString('vi-VN')}        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

module.exports = app;
