const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet'); // <-- 1. IMPORT SECURITY PACKAGES
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const startReminderService = require('./services/reminderService');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- 2. APPLY SECURITY MIDDLEWARE ---

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json());

// Data sanitization against NoSQL query injection
// This should be after the body parser
app.use(mongoSanitize());

// Enable CORS
app.use(cors());


// --- 3. CONFIGURE AND APPLY RATE LIMITING ---

// Create a limiter for authentication routes (stricter)
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 login/signup requests per 15 minutes
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Create a general limiter for all other API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply the limiters to the routes
app.use('/api', apiLimiter); // Apply general limiter to all routes starting with /api
app.use('/api/auth', authLimiter); // Override with a stricter limiter for authentication routes


// --- 4. DEFINE ROUTES (AFTER ALL MIDDLEWARE) ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meetings', require('./routes/meetings'));

// Start Reminder Service
startReminderService();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
