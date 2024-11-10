import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  getSinglePost,
  editPost,
  getRandomPosts,
  searchPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/random", getRandomPosts);
router.get("/:id", getSinglePost);
router.get("/search/:query", searchPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.put("/edit/:id", protectRoute, editPost);
router.delete("/:id", protectRoute, deletePost);
export default router;
