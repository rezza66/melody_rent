import React, { useState } from "react";
import { Menu, User, ChevronDown, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { RootState } from "../redux/store";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsDropdownOpen(false); 
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = () => {
    setIsDropdownOpen(false);
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">RentMusik</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 transition duration-300 ${
                  isActive ? "font-bold text-blue-600" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* User Info / Auth Button */}
          <div className="relative">
            {token ? (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleDropdownClick}
              >
                <span className="text-gray-700 font-semibold hover:text-blue-600 transition">
                  {user?.name}
                </span>
                <ChevronDown size={16} />
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-md flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <User size={16} />
                <span>Masuk</span>
              </NavLink>
            )}
            {isDropdownOpen && token && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md overflow-hidden">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleOptionClick}
                >
                  Profil
                </NavLink>

                {/* Jika pengguna bukan admin, tampilkan opsi peminjaman & pengembalian */}
                {user?.role !== "admin" && (
                  <>
                    <NavLink
                      to="/my-loan"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={handleOptionClick}
                    >
                      Peminjaman Anda
                    </NavLink>
                    <NavLink
                      to="/my-return"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={handleOptionClick}
                    >
                      Pengembalian Anda
                    </NavLink>
                  </>
                )}

                {/* Jika pengguna adalah admin, tampilkan opsi Dashboard */}
                {user?.role === "admin" && (
                  <NavLink
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleOptionClick}
                  >
                    Dashboard
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 space-y-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className="block text-gray-700 hover:text-blue-600 transition duration-300"
            >
              {item.label}
            </NavLink>
          ))}
          {token ? (
            <div className="mt-4">
              <span className="block text-gray-700 font-semibold">{user?.name}</span>

              {/* Jika bukan admin, tampilkan opsi peminjaman & pengembalian */}
              {user?.role !== "admin" && (
                <>
                  <NavLink
                    to="/my-loan"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Peminjaman Anda
                  </NavLink>
                  <NavLink
                    to="/my-return"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Pengembalian Anda
                  </NavLink>
                </>
              )}

              {/* Jika admin, tampilkan opsi Dashboard */}
              {user?.role === "admin" && (
                <NavLink
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="block w-full text-left mt-2 px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Keluar
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Masuk
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
