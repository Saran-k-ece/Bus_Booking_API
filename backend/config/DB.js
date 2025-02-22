const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://saran:bus123@cluster0.ws8l7.mongodb.net/BusBookingSystem',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

module.exports = ConnectDB;
