const express = require("express");
const router = express.Router();
const { addBus, updateBus ,getAllBuses} = require("../controllers/busController");
const { verifyToken , verifyAdmin, verifyAdminOrSelf,verifyUser} = require("../middleware/authMiddleware");

router.post("/addBus", verifyToken ,verifyAdmin, addBus);
router.put("/updateBus/:id",verifyToken, verifyAdmin, updateBus);
router.get("/allbus",getAllBuses)

module.exports = router;
