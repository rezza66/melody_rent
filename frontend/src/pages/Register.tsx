import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { register } from "../redux/authSlice";
import { assets } from "../assets/assets";
import { useNavigate, Link } from "react-router-dom";

// Type definition matching the Mongoose schema
type UserRegistration = {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  role: "admin" | "user";
  image: File | null;
};

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserRegistration>({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    role: "user",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("role", formData.role);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    dispatch(register(formDataToSend));
    navigate('/login')
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center mt-16 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex flex-col md:flex-row items-center">
        <div className="hidden md:block w-1/2">
          <img
            src={assets.registerImg}
            alt="Register Illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
            Daftar Akun
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nama Lengkap"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Nomor Telepon"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Kata Sandi"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Alamat"
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="user">Pengguna</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
