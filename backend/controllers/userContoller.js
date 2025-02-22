const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//User Register
const register = async (req,res,next) => { 
    try{
         
         const{username,email,password} = req.body

         if(!username || !email || !password)
         {
            return res.status(400).json({success:false,message:"Username, email, and password are required"})
         }

         const existingUser = await User.findOne({email})
 
        if(existingUser)
        {
            return res.status(400).json({success:false,message:"Username already exist"})
        }

        //Password Hashing

        const genSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,genSalt)

        //User Creation
        const newUser = new User({
            username:username,
            email:email,
            password:hashedPassword
        })

        const savedUser = await newUser.save()

        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:{
                 id:savedUser._id,
                 username:savedUser.username,
                 email:savedUser.email
            }
        })

    }catch(err){
        next(err)
    }
}


//User Login
const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.name, email: user.email, isAdmin: user.isAdmin },
            process.env.ACCESS_SECRET_TOKEN,
            { expiresIn: '2h' }
        );

       
        res.cookie("access_user_token", token, {
            httpOnly: true,
        }).status(200).json({ message: "Login successful", token ,user}); 

    } catch (err) {
        next(err);
    }
};

//Logout
const logoutUser = (req, res) => {
    res.clearCookie("access_user_token", { httpOnly: true, secure: true });
    return res.status(200).json({ message: "Logged out successfully" });
};


//Get

const getUser = async(req,res,next)=>{
    try{

     const userId = req.user.id;
     const targetUserId = req.params.id;

     if (userId !== targetUserId && !req.user.isAdmin) {
        return res.status(403).json({ message: "You are not authorized to view this user." });
    }

    const particularUser = await User.findById(targetUserId);

    if (!particularUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User is found", particularUser });
    
    }catch(err)
    {
        next(err)
    }
}


// GET ALL
const getAllUser = async (req, res, next) => {
    try { 
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to view all users." });
        }

        const allUser = await User.find();

        res.status(200).json({ message: "Users found", allUser });
    } catch (err) {
        next(err);
    }
};


// UPDATE  
const updateUser = async (req, res, next) => {
    try {
        // Allow users to update only their own profile
        // Get user ID from token
        const userId = req.user.id;   

        // ID from request params
        const targetUserId = req.params.id; 

        if (userId !== targetUserId && !req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to update this user." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            { $set: req.body },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User is updated", updatedUser });
    } catch (err) {
        next(err);
    }
};

//DELETE

const DeleteUser = async (req, res, next) => {
    try {
        // Get user ID from token
        const userId = req.user.id;   

        // ID from request params
        const targetUserId = req.params.id; 

        // Only the user or an admin can delete the user
        if (userId !== targetUserId && !req.user.isAdmin) {
            return res.status(403).json({ message: "You are not authorized to delete this user." });
        }

        const DeletedUser = await User.findByIdAndDelete(targetUserId);

        if (!DeletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", DeletedUser });
    } catch (err) {
        next(err);
    }
};



module.exports = {register,login,logoutUser,getUser,getAllUser,updateUser,DeleteUser}