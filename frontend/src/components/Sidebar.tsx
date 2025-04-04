import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Music, 
  Users, 
  Settings, 
  Calendar, 
  HelpCircle,
  Menu,
  X 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      route: '/dashboard' 
    },
    { 
      icon: Music, 
      label: 'Alat Musik', 
      route: '/instrument-list' 
    },
    { 
      icon: Users, 
      label: 'Pengguna', 
      route: '/pengguna' 
    },
    { 
      icon: Calendar, 
      label: 'Peminjaman', 
      route: '/peminjaman' 
    },
    { 
      icon: Settings, 
      label: 'Pengaturan', 
      route: '/pengaturan' 
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (label: string) => {
    onMenuChange(label);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Tombol Menu Mobile */}
      <button 
        className="md:hidden fixed top-16 right-4 z-50 bg-white p-2 rounded-lg shadow-md"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar Desktop */}
      <div className={`
        bg-white w-64 h-screen fixed mt-14 left-0 top-0 shadow-lg 
        transform transition-transform duration-300
        md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        z-40
      `}>
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Musik Rental</h2>
          <button 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <X />
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link 
              key={item.label}
              to={item.route}
              onClick={() => handleMenuClick(item.label)}
              className={`
                flex items-center p-4 transition-colors duration-200
                ${activeMenu === item.label 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <item.icon className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-14 w-full border-t">
          <Link 
            to="/bantuan" 
            className="flex items-center p-4 text-gray-700 hover:bg-gray-100"
          >
            <HelpCircle className="mr-3" />
            <span>Bantuan</span>
          </Link>
        </div>
      </div>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;