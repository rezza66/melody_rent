import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { login } from '../redux/authSlice';
import { assets } from '../assets/assets';
import { useNavigate, Link } from 'react-router-dom';

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login(credentials));
      if (login.fulfilled.match(resultAction)) {
        navigate('/'); // Redirect setelah login berhasil
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center mt-16 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl flex flex-col md:flex-row items-center">
        <div className="hidden md:block w-1/2">
          <img src={assets.loginImg} alt="Login Illustration" className="w-full h-auto rounded-lg" />
        </div>

        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Masuk ke Akun</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan alamat email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">Kata Sandi</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan kata sandi"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-700">Ingat saya</label>
              </div>
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar Sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
