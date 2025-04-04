import { registerValidation, loginValidation } from "../config/validation.js";
import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, role, address, phone } = req.body;

  try {
    // Cek jika user dengan email yang sama sudah ada
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validasi khusus untuk admin dengan password dari .env
    if (role === "admin" && password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({
        message: "Admin harus menggunakan password tertentu.",
      });
    }

    // Simpan user baru
    const user = await User.create({
      name,
      email,
      password,
      role,
      address,
      image: req.file ? req.file.path : null,
      phone,
    });

    // Kembalikan respons berhasil
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      address: user.address,
      phone: user.phone,
      token: generateToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};


export const loginUser = async (req, res) => {
  try {

    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (user.role === "admin" && password !== adminPassword) {
      return res.status(403).json({ message: "Password tidak valid untuk admin" });
    }

    // Login berhasil, respons dengan token
    res.status(200).json({
      message: "Login berhasil",
      token: generateToken(user.id), // Token dibuat menggunakan fungsi generateToken
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat login", error: error.message });
  }
};
