import express from "express";
import { protectRoute} from "../middleware/authMiddle.js";
import { getUsers, getMsgs,sendMsgs} from "../controllers/msgControl.js";

const router=express.Router();

router.get("/users",protectRoute,getUsers);
router.get("/:idx",protectRoute,getMsgs);
router.post("/send/:idx",protectRoute,sendMsgs)

export default router;