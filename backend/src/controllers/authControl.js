import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import { generateToken } from "../lib/token.js";
import cloud from "../lib/cloud.js"

export const signup=async (req,res)=>{
    const {fullName,email,password}=req.body;
    try {
        if(!email || !fullName || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password should be at least 6 characters"});
        }
        const user=await User.findOne({email});

        if (user) return res.status(400).json({message:"Email already exist"});

        const salt= await bcrypt.genSalt(10)
        const hashPass=await bcrypt.hash(password,salt)

        const newUser=new User({
            fullName,
            email,
            password:hashPass
        });

        await newUser.save();

        if (newUser){
            generateToken(newUser._id,res);
            res.status(201).json({
                _id:newUser._id,
                email:newUser.email,
                fullName:newUser.fullName,
                profilePic:newUser.profilePic
            });
        }
        else{
            res.status(400).json({message:"Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const login=async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isPassCorrect=await bcrypt.compare(password,user.password);
        if(!isPassCorrect){
           return res.status(400).json({message:"Invalid password"}); 
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            email:user.email,
            fullName:user.fullName,
            profilePic:user.profilePic,
        });
    } 
    catch (error) {
        console.log("Error in login",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } 
    catch (error) {
        console.log("Error in logged out controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const updateProfile =async (req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Picture is required"});
        }

        const uploadPic=await cloud.uploader.upload(profilePic);
        const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadPic.secure_url},{new:true});
        res.status(200).json(updateUser);
    } 
    catch (error) {
        console.log("Error in uploading",error);
        return res.status(500).json({message:"Internal server error"});
    }
};

export const authCheck= (req,res) =>{
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        res.status(200).json(req.user);
    } 
    catch (error) {
        console.log("Error in Authentication checking",error);
        return res.status(500).json({message:"Internal server error"});    
    }
};