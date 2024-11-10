import User from "../models/usermodel.js";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/postmodel.js";
import Notification from "../models/notificationmodel.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ error: "Post must have title, content, and category" });
    }

    if (!img) {
      return res.status(400).json({ error: "Post must have an image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      title,
      content,
      img,
      category,
    });

    await newPost.save();
    const followers = user.followers;
    for (let follower of followers) {
      const newNotification = new Notification({
        from: userId,
        to: follower,
        type: "post",
        content: `${user.username} created a new post: "${title}"`,
      });
      await newNotification.save();
    }
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    let { img } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (img && img !== post.img) {
      const oldImgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(oldImgId);

      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    } else {
      img = post.img;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, img, category },
      { new: true }
    ).populate({
      path: "user",
      select: ["-password", "-email"],
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log("Error in editPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(imgId);
      } catch (cloudinaryError) {
        console.log("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRandomPosts = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 5;
    const posts = await Post.aggregate([
      { $sample: { size: count } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.password": 0,
          "user.email": 0,
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getRandomPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    if (req.params.id) {
      return res.status(400).json({ error: "Invalid request for getAllPosts" });
    }
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: ["-password", "-email"],
      });

    if (posts.length === 0) return res.status(200).json([]);
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: ["-password", "-email"],
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "user",
      select: "-password -email",
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    console.log("Error in getSinglePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { query } = req.params;
    const searchRegex = new RegExp(query, "i");

    const posts = await Post.find({
      $or: [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: ["-password", "-email"],
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in searchPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
