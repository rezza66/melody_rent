import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstruments } from "../redux/instrumentSlice";
import { Category, fetchCategories } from "../api/categoryApi";
import { RootState, AppDispatch } from "../redux/store";
import { IMAGE_BASE_URL } from "../utils/config";
import {format} from 'date-fns';
import { createLoan, fetchUserLoans, LoanRequest } from "../api/loanApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Homepage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { instruments, loading, error } = useSelector(
    (state: RootState) => state.instrument
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

  useEffect(() => {
    dispatch(fetchInstruments());
  }, [dispatch]);



  const handleRent = (instrumentId: string) => {
    setSelectedInstrumentId(instrumentId);
    setShowModal(true);
  };


const confirmRent = async () => {
  if (!user || !user.id) {
    alert("User tidak ditemukan. Silakan login terlebih dahulu.");
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetchUserLoans(user.id);
    
    if (!response || !Array.isArray(response)) {
      throw new Error("Data peminjaman tidak valid atau gagal diambil.");
    }

    const myLoans = response;
    const activeLoans = myLoans.filter((loan: { status: string }) => loan.status === "ongoing").length;

    if (activeLoans >= 2) {
      alert("Kamu sudah mencapai batas peminjaman (maksimal 2 alat musik). Kembalikan alat terlebih dahulu.");
      setIsLoading(false);
      return;
    }

    if (!startDate || !endDate) {
      alert("Tanggal mulai dan selesai harus diisi.");
      setIsLoading(false);
      return;
    }
    if (startDate >= endDate) {
      alert("Tanggal mulai harus lebih awal dari tanggal selesai.");
      setIsLoading(false);
      return;
    }

    const loanData: LoanRequest = {
      user: user.id,
      instruments: [
        {
          instrumentId: selectedInstrumentId!,
          quantity: 1,
          startDate: format(startDate!, "yyyy-MM-dd"),
          endDate: format(endDate!, "yyyy-MM-dd"),
        },
      ],
    };

    await createLoan(loanData);
    alert("Peminjaman berhasil!");

  } catch (error: any) {

    if (error.response?.status === 400) {
      alert("Peminjaman gagal! Pastikan kamu tidak melebihi batas peminjaman.");
    } else {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }

  } finally {
    setIsLoading(false);
    setShowModal(false);
    setStartDate(null);
    setEndDate(null);
  }
};

  const filteredInstruments = instruments.filter((instrument) => {
    const matchesSearch = instrument.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (typeof instrument.category === "string"
        ? instrument.category === selectedCategory
        : instrument.category._id === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#497D74] mt-16 p-6">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Rental Alat Musik
          </h1>
          <p className="text-white">
            Sewa alat musik berkualitas dengan mudah dan terjangkau
          </p>
        </header>

        <div className="mb-6 flex justify-center gap-4">
          <input
            type="text"
            placeholder="Cari alat musik..."
            className="p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="p-2  border rounded"
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            value={selectedCategory || ""}
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-600">Terjadi kesalahan: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-6">
            {filteredInstruments.map((instrument) => (
              <div
                key={instrument._id}
                className="bg-[#EFE9D5] rounded-xl shadow-lg overflow-hidden flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={`${IMAGE_BASE_URL}/${instrument.image}`}
                    alt={instrument.name}
                    className="w-full h-80 object-cover"
                  />
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                      instrument.available && instrument.stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {instrument.available && instrument.stock > 0
                      ? `Tersedia (${instrument.stock} unit)`
                      : "Tidak Tersedia"}
                  </span>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-2xl font-bold mb-3 text-gray-800">
                    {instrument.name}
                  </h2>
                  <p className="text-gray-600 mb-4 flex-grow text-sm leading-relaxed">
                    {instrument.description}
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-blue-700 font-bold text-xl">
                        Rp {instrument.pricePerDay.toLocaleString()}/hari
                      </span>
                    </div>
                    <button
                      disabled={
                        !instrument.available ||
                        instrument.stock === 0 ||
                        isLoading
                      }
                      onClick={() => handleRent(instrument._id)}
                      className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                        instrument.available && instrument.stock > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isLoading ? "Memproses..." : "Sewa Sekarang"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal untuk Date Picker */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold mb-4">Pilih Tanggal Sewa</h2>
            <div className="mb-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Pilih tanggal mulai"
                className="p-2 border rounded mr-4"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Pilih tanggal selesai"
                className="p-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={confirmRent}
                className="bg-blue-600 text-white p-2 rounded mr-2"
              >
                Konfirmasi Sewa
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 p-2 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
