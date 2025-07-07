import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"No token"});
        }
        console.log("Cookies received:", req.cookies); 

        const verifyUser=jwt.verify(token,process.env.JWT_SECRET);
        if(!verifyUser){
            return res.status(401).json({message:"Invalid Token"});
        }
        console.log("Decoded JWT:", verifyUser);

        const user=await User.findById(verifyUser.userId).select("-password");

        if(!user){
            return res.status(404).json({message:"There is no user"});
        }
        req.user=user;
        next();
    } 
    catch (error) {
        console.error("Error in middleware",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};