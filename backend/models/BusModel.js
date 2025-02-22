const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    number: {  
        type: String, 
        required: true, 
        unique: true
    },
    busType: {
        type: String,
        required: true,
        enum: ["SemiSleeper", "Sleeper"],
        default: "SemiSleeper"
    },
    totalSeats: { 
        type: Number, 
        required: true 
    },
    availableSeats: { 
        type: Number, 
        required: true 
    },
    route: { 
        type: String, 
        required: true 
    },
    departureTime: { 
        type: String,  
        required: true 
    },
    arrivalTime: { 
        type: String,  
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
