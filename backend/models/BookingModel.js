const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user:
   { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
   },
  bus: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Bus", 
    required: true 
  },
  seats: 
  { 
    type: Number, 
    required: true 
  },
  payment: {
    type: String,
    enum: ["Paid", "Pending", "NotPaid"], 
    default: "Pending",
  },
  
  status: 
  { 
    type: String, 
    enum: ["Booked", "Cancelled"], 
    default: "Booked" 
  },
  bookedAt: 
  { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
