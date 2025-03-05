import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nama pengguna
  email: { type: String, required: true, unique: true }, // Email pengguna
  phone: { type: String, required: true }, // Nomor telepon
  password: { type: String, required: false }, 
  address: { type: String, required: true }, // Alamat pengguna
  role: { type: String, enum: ["admin", "user"], default: "user" }, // Peran pengguna
  image: { type: String },
  createdAt: { type: Date, default: Date.now }, // Tanggal pembuatan akun
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
