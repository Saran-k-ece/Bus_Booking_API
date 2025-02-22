const Bus = require('../models/BusModel')


//Add Bus
const addBus = async(req,res,next) => {
    try{
 
        const{name, number, totalSeats, busType,route, departureTime, arrivalTime } = req.body

        const existingBus = await Bus.findOne({number})

        if(existingBus)
        {
            return res.status(400).json({
                success:false,
                message:"The bus number is already exist"  
            })
        }

        const newBus = new Bus({
            name,
            number,
            totalSeats,
            busType:busType || "SemiSleeper",
            availableSeats: totalSeats,
            route,
            departureTime,
            arrivalTime
        })

        const savedBus = await newBus.save()

        res.status(201).json({ 
            success: true, 
            message: "Bus added successfully", 
            bus: savedBus 
        });
  


    }catch(err)
    {
        next(err)
    }
}

//Update Bus


const updateBus = async (req, res, next) => {
    try {
        
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to update this bus." });
        }

       
        const updatedBus = await Bus.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true } 
        );

 
        if (!updatedBus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        res.status(200).json({ success: true, message: "Bus is updated", updatedBus });

    } catch (err) {
        console.error("Error updating bus:", err.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


//View Bus

const getAllBuses = async (req, res, next) => {
    try {
        const buses = await Bus.find();

        if (buses.length === 0) {
            return res.status(404).json({ success: false, message: "No buses available" });
        }

        res.status(200).json({ success: true, buses });

    } catch (err) {
        console.error("Error fetching buses:", err.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};




module.exports = {addBus,updateBus,getAllBuses}