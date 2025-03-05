import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Katalog', href: '/katalog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">
            RentMusik
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item) => (
            <NavLink 
              key={item.label} 
              to={item.href} 
              className={({ isActive }) => 
                `text-gray-700 hover:text-blue-600 transition duration-300 ${isActive ? 'font-bold text-blue-600' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          
          {/* Keranjang & Sign In */}
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition">
              <User size={16} />
              <span>Masuk</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink 
                key={item.label} 
                to={item.href} 
                className={({ isActive }) => 
                  `block text-gray-700 hover:bg-gray-100 py-2 ${isActive ? 'font-bold text-blue-600' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            {/* Mobile Buttons */}
            <div className="flex flex-col space-y-2 pt-2">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 rounded-md">
                <User size={16} />
                <span>Masuk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
