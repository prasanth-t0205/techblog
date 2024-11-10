import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollow,
  getUserProfile,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollow);
router.post("/update", protectRoute, updateProfile);

export default router;
