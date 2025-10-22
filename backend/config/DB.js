const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ksaran0006_db_user:bus@cluster0.ga2amgh.mongodb.net/BusBooking',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database connected");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

module.exports = ConnectDB;
