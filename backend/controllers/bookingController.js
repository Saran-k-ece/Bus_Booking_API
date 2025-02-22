const Booking = require("../models/BookingModel");
const Bus = require("../models/BusModel");

// Book a bus
const bookBus = async (req, res) => {
  try {
    const { busId, seats ,payment} = req.body;

    if (!busId || !seats || seats <= 0) {
      return res.status(400).json({ message: "Invalid booking details" });
    }

    const bus = await Bus.findById(busId);
    if (!bus)
        {
             return res.status(404).json({ message: "Bus not found" });
        }
    // Check seat availability
    const bookedSeats = await Booking.aggregate([
      { $match: { bus: bus._id, status: "Booked" } },
      { $group: { _id: "$bus", totalSeats: { $sum: "$seats" } } }
    ]);

    const availableSeats = bus.totalSeats - (bookedSeats[0]?.totalSeats || 0);

    if (seats > availableSeats) {
      return res.status(400).json({ message: `Only ${availableSeats} seats available` });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      bus: busId,
      seats,
      payment: ["Paid", "Pending"].includes(payment) ? payment : "Pending"
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
        { 
            return res.status(404).json({ message: "Booking not found" });
        }
        
    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });

  } catch (error) {
    console.error("Cancellation Error:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("bus", "name route totalSeats"); //.populate() is used to fetch referenced documents from another collection. 

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.json({ bookings });

  } catch (error) {
    console.error("Fetching Bookings Error:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};



module.exports = { bookBus, getUserBookings ,cancelBooking }