const jwt = require('jsonwebtoken')

//Verify token
const verifyToken = (req,res,next) => {
    const token =  req.cookies.access_user_token || req.cookies.access_admin_token 

    if(!token)
    {
        return res(401).json({success:false,message:"You are not authorized"})
    
    }

    jwt.verify(token,process.env.ACCESS_SECRET_TOKEN,(err,user)=>{
        if(err)
        {
            return res.status(403).json({success:false,message:"Token invalid"})
            
        }
        console.log("Token Verified - User Data:", user); 
        req.user = user //req.user = user will contain the decoded payload of the JWT token after successful verification
        next()
    })
}

//Middleware to verify user

const verifyUser = (req,res,next)=>{
    console.log("Decoded User:", req.user);
    verifyToken(req,res,()=>{
        if(req.user.id == req.params.id || req.user.isAdmin)
        {
            next()
        }
        else{
            res.status(403).json({ message: "You are not authorized to access this resource" });
        }
        
    })
}


//Middleware to verify user

const verifyAdmin = (req,res,next)=>{
   
    verifyToken(req,res,()=>{
        if(req.user.isAdmin)
        {
            next()
        }
        else{
            res.status(403).json({ message: "You are not authorized to access this resource" });
        }
        
    })

}

// Middleware to verify if the user is an admin or their own profile
const verifyAdminOrSelf = (req, res, next) => {
    verifyToken(req, res, () => {
        // Allow admin to access any user or user to access their own data
        if (req.user.isAdmin || req.user.id === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    });
};  



module.exports ={verifyToken ,verifyUser,verifyAdmin,verifyAdminOrSelf}