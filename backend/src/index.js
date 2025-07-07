import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import msgRoute from "./routes/msgRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDb from "./lib/database.js"
import path from "path"
import {app,server} from "./lib/socket.js"

dotenv.config()

const port=process.env.port
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));


app.use("/api/auth",authRoute)
app.use("/api/msg",msgRoute)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(port,()=>{
    console.log("server is running on port:"+ port);
    connectDb();
});
