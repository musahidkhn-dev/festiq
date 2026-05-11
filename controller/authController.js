import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../Middleware/cloudinaryMiddleware.js";
import fs from "node:fs";

const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  //Check if all fields are coming
  if (!name || !email || !phone || !password) {
    res.status(409);
    throw new Error("Please Fill All Details!");
  }

  //Check if user exist
  let emailExist = await User.findOne({ email: email });
  let phoneExist = await User.findOne({ phone: phone });

  if (emailExist || phoneExist) {
    res.status(400);
    throw new Error("User Already Exists!");
  }

  //Hash Password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  if (!user) {
    res.status(400);
    throw new Error("User not created!");
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    isAdmin: user.isAdmin,
    isActive: user.isActive,
    credits : user.credits,
    token: generateToken(user._id),
    createdAt : user.createdAt
  });
};

const loginUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  //Check if all fields are coming
  if (!email || !password) {
    res.status(409);
    throw new Error("Please Fill All Details!");
  }

  //Check if user exist
  let user = await User.findOne({ email: email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      credits : user.credits,
      token: generateToken(user._id),
      createdAt : user.createdAt
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials!");
  }
};

// Private Controller
const privateController = (req, res) => {
  res.send("Private Controller " +  req.user.name);
};

//Generate Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

// Get Current User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    throw new Error("Error fetching profile");
  }
};

// Update Profile (name, phone)
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone, _id: { $ne: user._id } });
      if (phoneExists) {
        res.status(400);
        throw new Error("Phone number already in use");
      }
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    const updatedUser = await user.save();

    // Update localStorage token data
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      isActive: updatedUser.isActive,
      credits: updatedUser.credits,
      token: generateToken(updatedUser._id),
      createdAt: updatedUser.createdAt,
      message: "Profile updated successfully"
    });
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) res.status(500);
    throw new Error(error.message || "Failed to update profile");
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Please provide current and new password");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) res.status(500);
    throw new Error(error.message || "Failed to change password");
  }
};

// Forgot Password (email + phone verification)
const forgotPassword = async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    if (!email || !phone || !newPassword) {
      res.status(400);
      throw new Error("Please provide email, phone, and new password");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    // Find user matching both email AND phone for identity verification
    const user = await User.findOne({ email, phone });
    if (!user) {
      res.status(404);
      throw new Error("No account found with that email and phone combination");
    }

    // Hash and save new password
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login."
    });
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) res.status(500);
    throw new Error(error.message || "Failed to reset password");
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an image");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      if (req.file.path) fs.unlinkSync(req.file.path);
      res.status(404);
      throw new Error("User not found");
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path);
    if (req.file.path) fs.unlinkSync(req.file.path);

    if (!uploadResult || !uploadResult.secure_url) {
      res.status(500);
      throw new Error("Failed to upload image to cloud storage");
    }

    user.profilePicture = uploadResult.secure_url;
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      isActive: updatedUser.isActive,
      credits: updatedUser.credits,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id),
      createdAt: updatedUser.createdAt,
      message: "Avatar updated successfully"
    });
  } catch (error) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
    if (!res.statusCode || res.statusCode === 200) res.status(500);
    throw new Error(error.message || "Failed to update avatar");
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.profilePicture) {
      // Extract public ID from Cloudinary URL
      // Example URL: https://res.cloudinary.com/dkmn1reds/image/upload/v1715340000/avatar-uuid.png
      const urlParts = user.profilePicture.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const publicId = fileName.split('.')[0];
      
      await deleteFromCloudinary(publicId);
    }

    user.profilePicture = null;
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      isActive: updatedUser.isActive,
      credits: updatedUser.credits,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id),
      createdAt: updatedUser.createdAt,
      message: "Avatar removed successfully"
    });
  } catch (error) {
    if (!res.statusCode || res.statusCode === 200) res.status(500);
    throw new Error(error.message || "Failed to remove avatar");
  }
};

const authController = { registerUser, loginUser, privateController, getProfile, updateProfile, changePassword, forgotPassword, updateAvatar, deleteAvatar };

export default authController;

