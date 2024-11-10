import Notification from "../models/notificationmodel.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username })
      .select("-password")
      .populate("followers", "username profileImg")
      .populate("following", "username profileImg");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error in getUserProfile Controller", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res.status(400).json({ error: "You cannot follow yourself" });

    if (!userToModify || !currentUser)
      return res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      const notification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
        content: `${currentUser.username} started following you.`,
      });

      await notification.save();

      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.log("Error in follow / unfollow Controller", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const {
    fullname,
    username,
    email,
    currentPassword,
    newPassword,
    bio,
    socialLinks,
    deleteProfileImage,
  } = req.body;
  let { profileImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Incorrect current password" });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (deleteProfileImage) {
      if (user.profileImg) {
        const publicId = user.profileImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      user.profileImg = "";
    } else if (profileImg) {
      try {
        if (user.profileImg) {
          const publicId = user.profileImg.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
        const uploadResult = await cloudinary.uploader.upload(profileImg);
        user.profileImg = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary error:", cloudinaryError);
      }
    }

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.socialLinks = socialLinks || user.socialLinks;

    await user.save();
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateProfile Controller", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the profile" });
  }
};
