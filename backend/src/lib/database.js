import mongoose from "mongoose";

const connectDb=async()=>{
    try {
        const con=await mongoose.connect(process.env.mongo_uri);
        console.log(`Mongodb connected:${con.connection.host}`);
    } 
    catch (error) {
        console.log("Mongodb not connected",error);
    }
};

export default connectDb;