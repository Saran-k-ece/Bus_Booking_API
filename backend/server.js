const express = require('express')
const dotenv = require('dotenv').config()
const ConnectDB = require('./config/DB')
const cookieParser  = require('cookie-parser')

// Database Connection
ConnectDB();

// Creates an instance of an Express application
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));  
app.use('/api/bus', require('./routes/busRoutes'));
app.use('/api/booking',require('./routes/bookingRoutes'));

// Error Handler Middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something Went Wrong!"
    });
});

// PORT DECLARATION
const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
