import User from "../models/UserModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
      const id = req.user.id;
      const user = await User.findById(id).select("-password"); 

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE a new user
export const createUser = async (req, res) => {
  const { name, email, phone, address, role } = req.body;
  try {
    const newUser = new User({ name, email, phone, address, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE a user
export const updateUser = async (req, res) => {
  try {

    const updateData = { ...req.body };

    // Cek apakah ada file yang diunggah
    if (req.file) {
      updateData.image = req.file.path.replace("\\", "/"); // Gunakan path gambar baru
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    console.log("Updated User:", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: error.message });
  }
};


// DELETE a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.image) {
      const imagePath = path.join(__dirname, "..", user.image);
      fs.unlink(imagePath, () => {}); // Abaikan semua hasil
    }

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
    
  } catch (error) {
    return res.status(500).json({ 
      message: "Failed to delete user",
      ...(process.env.NODE_ENV === 'development' && { detail: error.message })
    });
  }
};