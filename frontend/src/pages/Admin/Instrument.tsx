import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchInstruments, deleteInstrument, } from "../../redux/instrumentSlice";
import { Category, fetchCategories } from "../../api/categoryApi";
import Sidebar from "../../components/Sidebar";
import { BASE_URL } from "../../utils/config";
import { useNavigate } from "react-router-dom";

const InstrumentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { instruments, loading, error } = useSelector(
    (state: RootState) => state.instrument
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeMenu, setActiveMenu] = useState<string>("Instruments");

  useEffect(() => {
    dispatch(fetchInstruments());
  }, [dispatch]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

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

  const handleEdit = (id: string) => {
    navigate(`/edit-instrument/${id}`);
  };
  


  const handleDelete = (_id: string) => {
    dispatch(deleteInstrument(_id));
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <div className="w-full md:ml-64 min-h-screen bg-gray-100 mt-12 p-4 md:p-6 pt-20 md:pt-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Daftar Instrumen
        </h2>
        <div className="mb-6 flex flex-col md:flex-row justify-center gap-4">
          <input
            type="text"
            placeholder="Cari alat musik..."
            className="p-2 border rounded w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded w-full md:w-64"
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col space-y-6">
            {loading ? (
              <p className="text-center text-gray-600">Memuat data...</p>
            ) : error ? (
              <p className="text-center text-red-600">Terjadi kesalahan: {error}</p>
            ) : (
              filteredInstruments.map((instrument) => (
                <div
                  key={instrument._id}
                  className="bg-white max-w-full rounded-xl shadow-lg overflow-hidden flex flex-row transform transition duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
                >
                  <div className="relative w-1/3">
                    <img
                      src={`${BASE_URL}/${instrument.image}`}
                      alt={instrument.name}
                      className="w-full h-48 object-cover rounded-l-lg"
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
                  <div className="p-6 flex-grow flex flex-col w-2/3">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">
                      {instrument.name}
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-grow">
                      {instrument.description}
                    </p>
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <span className="text-blue-700 font-bold text-lg">
                        Rp {instrument.pricePerDay.toLocaleString()}/hari
                      </span>
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                          onClick={() => handleEdit(instrument._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition"
                          onClick={() => handleDelete(instrument._id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentList;
