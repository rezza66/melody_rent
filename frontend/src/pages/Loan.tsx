// LoanPage.tsx
import React, { useState, useEffect } from "react";
import { Loan, fetchUserLoans } from "../api/loanApi";
import { returnInstrument } from "../api/returnApi";
import { differenceInDays } from "date-fns";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const LoanPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setReturnLoading] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const getLoans = async () => {
      if (!user || !user._id) {
        setError("User tidak ditemukan.");
        return;
      }
      try {
        setLoading(true);
        const data = await fetchUserLoans(user._id);
        console.log("Data loans dari API:", data);
        setLoans(data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    getLoans();
  }, []);

  // Fungsi untuk mendapatkan status badge dengan warna yang sesuai
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Sedang Dipinjam
          </span>
        );
      case "returned":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Dikembalikan
          </span>
        );
      case "overdue":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Terlambat
          </span>
        );
      default:
        return null;
    }
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Tanggal tidak valid";
    }
  };

  // Fungsi untuk menghitung hari tersisa untuk peminjaman yang sedang berlangsung
  const calculateRemainingDays = (endDate: string) => {
    const today = new Date().toDateString();
    const end = new Date(endDate).toDateString();
    const diffDays = differenceInDays(new Date(end), new Date(today));
  
    if (diffDays < 0) {
      return <span className="text-red-600 font-medium">{Math.abs(diffDays)} hari keterlambatan</span>;
    } else if (diffDays === 0) {
      return <span className="text-orange-600 font-medium">Jatuh tempo hari ini</span>;
    }
    return <span className="text-gray-600">{diffDays} hari tersisa</span>;
  };

  const handleReturnInstrument = async (loanId: string) => {
    setReturnLoading(loanId);
    try {
      await returnInstrument(loanId, "good");
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === loanId ? { ...loan, status: "returned" } : loan
        )
      );
      alert("Instrumen berhasil dikembalikan");
      navigate("/my-return");
    } catch (error) {
      console.error("Gagal mengembalikan instrumen:", error);
      alert("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setReturnLoading(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Agar tidak ada angka desimal
    }).format(amount);
  };
  

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Memuat data peminjaman...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 mt-20 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-800 underline hover:text-red-900"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Peminjaman Instrumen Saya
        </h2>
        <div className="py-8">
          <p className="text-gray-500">Anda belum memiliki peminjaman.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md mt-20 overflow-hidden w-6/7 max-w-full mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Peminjaman Instrumen Saya
        </h2>
        <p className="text-gray-500 mt-1">
          Anda saat ini memiliki{" "}
          {loans.filter((loan) => loan.status === "ongoing").length} peminjaman
          aktif
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Instrumen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Tanggal Mulai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Tanggal Berakhir
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Total Biaya Sewa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Waktu Tersisa
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {loan.instrument.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {loan.instrument.category.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {loan.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(loan.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(loan.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(loan.totalRentalFee)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(loan.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {loan.status === "ongoing" ? (
                    calculateRemainingDays(loan.endDate)
                  ) : (
                    <span className="text-gray-500">
                      {loan.status === "returned" ? "Dikembalikan" : "Terlambat"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {loan.status === "ongoing" && (
                    <button
                      onClick={() => handleReturnInstrument(loan._id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Kembalikan
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          * Harap kembalikan instrumen yang dipinjam sebelum tanggal jatuh tempo
          untuk menghindari status keterlambatan.
        </p>
      </div>
    </div>
  );
};

export default LoanPage;
