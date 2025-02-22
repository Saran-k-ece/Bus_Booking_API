const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res, next) => {
    try {
        
        const existingAdmin = await Admin.findOne({ email: req.body.email });
          
        if (existingAdmin) {
            return res.status(400).json({ message: "Username or email already exists" });
        }   

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new Admin({
            username: req.body.username,  
            email: req.body.email,
            password: hashedPassword,
            isAdmin: true 
        });

       const savedAdmin =  await newUser.save();
        res.status(201).json({ message: "Admin user has been created successfully",
            admin:{
                   adminName:savedAdmin.username,
                   isAdmin:savedAdmin.isAdmin
            }
         });
    } catch (err) {
        next(err);
    }
};

// LOGIN
const login = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ email:req.body.email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Wrong password or username" });
        }
   
        // Generate token
        const token = jwt.sign({
            id: admin._id,
            isAdmin: admin.isAdmin 
        }, process.env.ACCESS_SECRET_TOKEN, {
            expiresIn: "2h"
        });

    
        const { password, isAdmin, ...otherDetails } = admin._doc;

        res.clearCookie("access_user_token");
        res.cookie("access_admin_token", token, {
            httpOnly: true, 
        }).status(200).json({ message: "Login successful", ...otherDetails });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
