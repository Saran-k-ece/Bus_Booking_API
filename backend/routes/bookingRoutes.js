const express = require("express");
const router = express.Router();
const {bookBus,getUserBookings ,cancelBooking} = require('../controllers/bookingController')
const {verifyToken } = require("../middleware/authMiddleware");

router.post("/book", verifyToken,bookBus);
router.put("/cancel/:id", verifyToken,cancelBooking);
router.get("/my-bookings", verifyToken,getUserBookings);

module.exports = router;
