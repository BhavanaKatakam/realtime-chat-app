import express from "express"
import {login, signup, logout, updateProfile, authCheck} from "../controllers/authControl.js"
import {protectRoute} from "../middleware/authMiddle.js"

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/updateprofile",protectRoute, updateProfile);
router.get("/check",protectRoute, authCheck);

export default router;