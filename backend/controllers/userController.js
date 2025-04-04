import User from "../models/UserModel.js";

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
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
