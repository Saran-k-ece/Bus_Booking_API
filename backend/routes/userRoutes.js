const express = require('express')
const router =  express.Router()
const {register,login,logoutUser,getUser,getAllUser,updateUser,DeleteUser} = require ('../controllers/userContoller'); 
const {verifyToken ,verifyUser,verifyAdmin,verifyAdminOrSelf }   = require('../middleware/authMiddleware')

// User Routes
  
// Public route for user registration
router.post('/register',register);      

// Public route for user login  
router.post('/login',login);   

// Public route for user login  
router.post('/logout',logoutUser);   

//Public route for get particularUser
router.get('/particularUser/:id',verifyToken,verifyUser,getUser)

//Public route for get allUser
router.get('/allUser',verifyToken,verifyAdmin,getAllUser)
   

//Public route for upadateUser
router.put('/updateUser/:id',verifyToken,verifyAdminOrSelf,updateUser)

//Public route for DeleteUser
router.delete('/deleteUser/:id',verifyToken,verifyAdminOrSelf,DeleteUser)
     


module.exports = router;