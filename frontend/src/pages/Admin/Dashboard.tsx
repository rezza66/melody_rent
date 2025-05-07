import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchInstruments } from "../../redux/instrumentSlice";
import { getAllUser } from "../../redux/userSlice";
import { fetchLoans } from "../../api/loanApi"; // Import fungsi dari loanApi
import { Music, Users, Clock, CheckCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../../components/Sidebar";
import { Loan } from "../../api/loanApi"; // Import tipe Loan

interface PeminjamanGrafikItem {
  bulan: string;
  peminjaman: number;
}

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>("Dashboard");
  const [recentLoans, setRecentLoans] = useState<Loan[]>([]);
  const [loadingLoans, setLoadingLoans] = useState<boolean>(true);
  const [loanError, setLoanError] = useState<string | null>(null);
  const [pagination] = useState({
    currentPage: 1,
    itemsPerPage: 5, // atau sesuai dengan limit yang Anda gunakan
  });

  const dispatch = useDispatch<AppDispatch>();
  const { instruments } = useSelector((state: RootState) => state.instrument);
  const { users } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Load semua data yang diperlukan
    const loadData = async () => {
      try {
        await dispatch(fetchInstruments());
        await dispatch(getAllUser());

        // Ambil data peminjaman terbaru
        const { data } = await fetchLoans(1, 5); // Ambil 5 data terbaru
        setRecentLoans(data);
        setLoadingLoans(false);
      } catch (error) {
        setLoanError("Gagal memuat data peminjaman");
        setLoadingLoans(false);
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [dispatch]);

  const totalInstruments = instruments.length;
  const instrumentTersedia = instruments.filter(
    (instr) => instr.available
  ).length;
  const userTerdaftar = users.length;
  const activePeminjaman = recentLoans.filter(
    (loan) => loan.status === "ongoing"
  ).length;

  const stats = {
    totalInstruments,
    activePeminjaman,
    userTerdaftar,
    instrumentTersedia,
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "ongoing":
        return "Aktif";
      case "returned":
        return "Selesai";
      case "overdue":
        return "Terlambat";
      default:
        return status;
    }
  };

  // Data grafik peminjaman per bulan
  const peminjamanGrafikData: PeminjamanGrafikItem[] = [
    { bulan: "Jan", peminjaman: 40 },
    { bulan: "Feb", peminjaman: 55 },
    { bulan: "Mar", peminjaman: 45 },
    { bulan: "Apr", peminjaman: 60 },
    { bulan: "Mei", peminjaman: 50 },
    { bulan: "Jun", peminjaman: 65 },
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Dashboard
        </h1>

        {/* Statistik Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center">
            <Music className="mr-2 md:mr-4 text-blue-500 w-6 h-6 md:w-auto md:h-auto" />
            <div>
              <h3 className="text-sm md:text-lg font-semibold">
                Total Instrumen
              </h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800">
                {stats.totalInstruments}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center">
            <Clock className="mr-2 md:mr-4 text-green-500 w-6 h-6 md:w-auto md:h-auto" />
            <div>
              <h3 className="text-sm md:text-lg font-semibold">
                Peminjaman Aktif
              </h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800">
                {stats.activePeminjaman}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center">
            <Users className="mr-2 md:mr-4 text-purple-500 w-6 h-6 md:w-auto md:h-auto" />
            <div>
              <h3 className="text-sm md:text-lg font-semibold">
                User Terdaftar
              </h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800">
                {stats.userTerdaftar}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex items-center">
            <CheckCircle className="mr-2 md:mr-4 text-teal-500 w-6 h-6 md:w-auto md:h-auto" />
            <div>
              <h3 className="text-sm md:text-lg font-semibold">
                Instrumen Tersedia
              </h3>
              <p className="text-lg md:text-2xl font-bold text-gray-800">
                {stats.instrumentTersedia}
              </p>
            </div>
          </div>
        </div>

        {/* Grafik Peminjaman */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
            Grafik Peminjaman
          </h2>
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
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
            Peminjaman Terbaru
          </h2>

          {loadingLoans ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : loanError ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {loanError}
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama Peminjam</th>
                  <th className="p-3 text-left">Instrumen</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.length > 0 ? (
                  recentLoans.map((loan, index) => (
                    <tr key={loan._id} className="border-b">
                      <td className="p-3">
                        {(pagination.currentPage - 1) *
                          pagination.itemsPerPage +
                          index +
                          1}
                      </td>
                      <td className="p-3">{loan.user?.name || "Unknown"}</td>
                      <td className="p-3">
                        {loan.instrument?.name || "Unknown Instrument"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`
          px-3 py-1 rounded-full text-xs font-semibold
          ${
            loan.status === "ongoing"
              ? "bg-green-100 text-green-800"
              : loan.status === "returned"
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800"
          }
        `}
                        >
                          {formatStatus(loan.status)}
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-500">
                      Tidak ada data peminjaman
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
