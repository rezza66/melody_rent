import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchInstruments } from '../../redux/instrumentSlice';
import { getAllUser } from '../../redux/userSlice';
import { 
  Music, 
  Users, 
  Clock, 
  CheckCircle 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Sidebar from '../../components/Sidebar';

interface PeminjamanItem {
  id: number;
  nama: string;
  instrument: string;
  status: 'Aktif' | 'Selesai' | 'Terlambat';
}

interface PeminjamanGrafikItem {
  bulan: string;
  peminjaman: number;
}

const AdminDashboard: React.FC = () => {
  // State untuk menu aktif sidebar
  const [activeMenu, setActiveMenu] = useState<string>('Dashboard');
  const dispatch = useDispatch<AppDispatch>();

  const { instruments } = useSelector((state: RootState) => state.instrument);
  const { users } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchInstruments());
    dispatch(getAllUser());
  }, [dispatch]);

  const totalInstruments = instruments.length;
  const instrumentTersedia = instruments.filter(instr => instr.available).length;

  const userTerdaftar = users.length;

  // State untuk statistik
  const stats = {
    totalInstruments,
    activePeminjaman: 15,
    userTerdaftar,
    instrumentTersedia
  };

  // Data peminjaman terbaru
  const recentPeminjaman: PeminjamanItem[] = [
    { id: 1, nama: 'Ahmad Yani', instrument: 'Gitar Elektrik', status: 'Aktif' },
    { id: 2, nama: 'Siti Rahma', instrument: 'Keyboard', status: 'Selesai' },
    { id: 3, nama: 'Budi Santoso', instrument: 'Drum Set', status: 'Terlambat' }
  ];

  // Data grafik peminjaman per bulan
  const peminjamanGrafikData: PeminjamanGrafikItem[] = [
    { bulan: 'Jan', peminjaman: 40 },
    { bulan: 'Feb', peminjaman: 55 },
    { bulan: 'Mar', peminjaman: 45 },
    { bulan: 'Apr', peminjaman: 60 },
    { bulan: 'Mei', peminjaman: 50 },
    { bulan: 'Jun', peminjaman: 65 }
  ];

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar 
        activeMenu={activeMenu} 
        onMenuChange={(menu) => setActiveMenu(menu)} 
      />
      
      {/* Konten Dashboard */}
      <div className="w-full md:ml-64 min-h-screen bg-gray-100 mt-12 p-4 md:p-6 pt-20 md:pt-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        
        {/* Statistik Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center">
            <Music className="mr-2 md:mr-4 text-blue-500 w-6 h-6 md:w-auto md:h-auto" />
            <div>
              <h3 className="text-sm md:text-lg font-semibold">Total Instrumen</h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800">{stats.totalInstruments}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center">
            <Clock className="mr-2 md:mr-4 text-green-500 w-6 h-6 md:w-auto md:h-auto" />
            <div>
              <h3 className="text-sm md:text-lg font-semibold">Peminjaman Aktif</h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800">{stats.activePeminjaman}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center">
            <Users className="mr-2 md:mr-4 text-purple-500 w-6 h-6 md:w-auto md:h-auto" />
            <div>
              <h3 className="text-sm md:text-lg font-semibold">User Terdaftar</h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800">{stats.userTerdaftar}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center">
            <CheckCircle className="mr-2 md:mr-4 text-teal-500 w-6 h-6 md:w-auto md:h-auto" />
            <div>
              <h3 className="text-sm md:text-lg font-semibold">Instrumen Tersedia</h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800">{stats.instrumentTersedia}</p>
            </div>
          </div>
        </div>
        
        {/* Grafik Peminjaman */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Grafik Peminjaman</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peminjamanGrafikData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="peminjaman" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Tabel Peminjaman Terbaru */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-x-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Peminjaman Terbaru</h2>
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nama Peminjam</th>
                <th className="p-3 text-left">Instrumen</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentPeminjaman.map((peminjaman) => (
                <tr key={peminjaman.id} className="border-b">
                  <td className="p-3">{peminjaman.id}</td>
                  <td className="p-3">{peminjaman.nama}</td>
                  <td className="p-3">{peminjaman.instrument}</td>
                  <td className="p-3">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${peminjaman.status === 'Aktif' ? 'bg-green-100 text-green-800' : 
                        peminjaman.status === 'Selesai' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'}
                    `}>
                      {peminjaman.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;