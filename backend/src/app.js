const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const athleteProfileRoutes = require('./routes/athleteProfileRoutes');
const scoutRoutes = require('./routes/scoutRoutes');
const metaRoutes = require('./routes/metaRoutes');

const app = express();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Enable CORS
app.use(cors());

// Rate limiting (100 requests per 10 mins)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again in 10 minutes',
});
app.use('/api', limiter);

// Log requests using morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', athleteProfileRoutes);
app.use('/api/v1/scout', scoutRoutes);
app.use('/api/v1/meta', metaRoutes);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
