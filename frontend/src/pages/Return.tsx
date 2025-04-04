import React, { useState, useEffect, Key, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Loader, AlertTriangle, Package, Calendar, Tag, CheckCircle, FileText, Bookmark } from "lucide-react";
import { fetchUserReturns } from "../api/returnApi";

interface Category {
  id: string;
  name: string;
}

interface Instrument {
  id: string;
  name: string;
  type?: string;
  description?: string;
  category: Category;  // Tambahkan property category
}

interface LoanData {
  id: string;
  user: string;
  instrument: Instrument;
  quantity: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

interface ReturnRecord {
  loan: string;
  condition: string;
  returnDate: string;
  id: string;
  createdAt: string;
}

interface FineRecord {
  loan: string;
  amount: number;
  reason: string;
  status: string;
  id: string;
  createdAt: string;
}

interface ReturnData {
  returnDate: string | number | Date;
  condition: ReactNode;
  loan: LoanData;
  _id: Key | null | undefined;
  message?: string;
  updatedLoan?: LoanData;
  returnRecord?: ReturnRecord;
  fineRecord?: FineRecord;
}

const ReturnPage: React.FC = () => {
  const [data, setData] = useState<ReturnData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data user dari Redux
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
  
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }
  
        const data = await fetchUserReturns();
  
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.returnDate).getTime() - new Date(a.returnDate).getTime()) 
          : [];
  
        setData(sortedData);
      } catch (err) {
        console.error("Gagal mengambil data pengembalian:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReturns();
  }, [user]);
  

  // Format tanggal ke format yang lebih mudah dibaca
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  // Dapatkan badge kondisi berdasarkan kondisi
  const getConditionBadge = (condition: ReactNode) => {
    if (typeof condition !== 'string') return null;
    
    const conditionText = condition.toString().toLowerCase();
    
    if (conditionText.includes('baik') || conditionText.includes('good')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          {condition}
        </span>
      );
    } else if (conditionText.includes('rusak') || conditionText.includes('damaged')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {condition}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Tag className="w-3 h-3 mr-1" />
          {condition}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[50vh]">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 w-12 h-12 mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Memuat data pengembalian...</p>
        </div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-3">
            <AlertTriangle className="text-red-500 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-red-700">Gagal memuat data pengembalian</h3>
          </div>
          <p className="text-red-600 mb-2">
            {error || "Tidak ada data pengembalian yang tersedia saat ini."}
          </p>
          <p className="text-gray-600 text-sm">
            Silakan coba lagi nanti atau hubungi dukungan jika masalah berlanjut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 mt-20 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Riwayat Pengembalian Saya</h1>
        <p className="text-gray-600">Lihat semua catatan pengembalian instrumen Anda</p>
      </div>
      
      <div className="space-y-6">
        {data.map((returnItem, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="border-b border-gray-300 bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="text-blue-600" size={20} />
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                    Pengembalian #{index + 1}
                  </h2>
                </div>
              </div>
            </div>

            {returnItem.loan && (
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Detail Instrumen</h3>
                        <p className="mt-1 text-base font-medium text-gray-900">
                          {returnItem.loan.instrument.name}
                        </p>
                        {/* Menampilkan kategori instrumen */}
                        <div className="mt-2 flex items-center">
                          <Bookmark className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-sm text-gray-500">
                            Kategori: {returnItem.loan.instrument.category?.name || "Tidak dikategorikan"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Tanggal Pengembalian</h3>
                        <p className="mt-1 text-base font-medium text-gray-900">
                          {formatDate(returnItem.returnDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Kondisi</h3>
                        <div className="mt-1">
                          {getConditionBadge(returnItem.condition)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {returnItem.fineRecord && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="text-yellow-500 mr-2" size={18} />
                      <h3 className="text-sm font-semibold text-yellow-800">Detail Denda</h3>
                    </div>
                    <p className="text-sm text-yellow-700">
                      <strong>Jumlah:</strong> Rp {returnItem.fineRecord.amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-yellow-700">
                      <strong>Alasan:</strong> {returnItem.fineRecord.reason}
                    </p>
                    <p className="text-sm text-yellow-700">
                      <strong>Status:</strong> {returnItem.fineRecord.status}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReturnPage;