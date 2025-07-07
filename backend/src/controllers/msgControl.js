import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloud from "../lib/cloud.js";
import {getReceiverSocketId,io} from "../lib/socket.js"

export const getUsers = async (req, res) => {
  try {
    const userLogged = req.user._id;
    console.log("Logged-in user ID:", userLogged); // 👈

    const allUsers = await User.find().select("-password");
    console.log("All users in DB:", allUsers); // 👈

    const filterUsers = await User.find({ _id: { $ne: userLogged } }).select("-password");
    console.log("Filtered users:", filterUsers); // 👈

    res.status(200).json(filterUsers);
  } catch (error) {
    console.error("Error in getting users", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMsgs=async(req,res)=>{
    try {
        const {idx: chatId}=req.params;
        const id=req.user._id;
        const msgs=await Message.find({
            $or:[
                {senderId:id,receiverId:chatId},
                {senderId:chatId,receiverId:id},
            ],
        });
        res.status(200).json(msgs);
    } 
    catch (error) {
        console.log("Error in getting msgs",error.message);
        res.status(500).json({error:"Internal server error"});
    }
};

export const sendMsgs=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {idx: receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;
        if(image){
            const uploadImage=cloud.uploader.upload(image);
            imageUrl=uploadImage.secure_url;
        }
        const newMsg=new Message({
            senderId,receiverId,text,image:imageUrl,
        });
        await newMsg.save();

        const receiverSocketId= getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMsg);
        }
        res.status(200).json(newMsg)
    } 
    catch (error) {
       console.log("error in sending message",error.message);
       res.status(500).json({message:"Internal server error"}); 
    }
};