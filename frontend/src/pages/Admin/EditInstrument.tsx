import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchInstruments, updateInstrument } from "../../redux/instrumentSlice";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import { fetchCategories, Category } from "../../api/categoryApi";

interface InstrumentFormData {
  name: string;
  type: string;
  brand: string;
  stock: number;
  pricePerDay: number;
  description: string;
  condition: "new" | "good" | "fair" | "damaged";
  available: boolean;
  image: string | File;
  category: string;
}

const EditInstrument: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { instruments, loading, error } = useSelector((state: RootState) => state.instrument);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<InstrumentFormData>({
    name: "",
    type: "",
    brand: "",
    stock: 0,
    pricePerDay: 0,
    description: "",
    condition: "new",
    available: true,
    image: "",
    category: ""
  });

  // Fetch instruments and categories
  useEffect(() => {
    if (instruments.length === 0) {
      dispatch(fetchInstruments());
    }

    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [dispatch, instruments.length]);

  // Initialize form data
  useEffect(() => {
    if (instruments.length > 0 && id) {
      const instrument = instruments.find((inst) => inst._id === id);
      if (instrument) {
        setFormData({
          name: instrument.name,
          type: instrument.type,
          brand: instrument.brand,
          stock: instrument.stock,
          pricePerDay: instrument.pricePerDay,
          description: instrument.description || "",
          condition: instrument.condition,
          available: instrument.available,
          image: instrument.image || "",
          category: typeof instrument.category === 'string' 
            ? instrument.category 
            : instrument.category?._id || ""
        });
        if (instrument.image) {
          setImagePreview(`${BASE_URL}/${instrument.image}`);
        }
      }
    }
  }, [instruments, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      let updatedValue: any = value;

      if (type === "number") {
        updatedValue = isNaN(Number(value)) ? 0 : Number(value);
      }

      const updatedFormData = { 
        ...prev, 
        [name]: updatedValue 
      };

      if (name === "stock") {
        updatedFormData.available = updatedValue > 0;
      }

      return updatedFormData;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const formDataToSend = new FormData();

    // Append all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && typeof value !== 'string') {
          formDataToSend.append(key, value);
        } else if (key !== 'image') {
          formDataToSend.append(key, String(value));
        }
      }
    });

    try {
      await dispatch(updateInstrument({ 
        id, 
        updatedInstrument: Object.fromEntries(formDataToSend) as any 
      })).unwrap();
      
      navigate("/instrument-list");
    } catch (error) {
      console.error("Error update:", error);
    }
  };

  if (loading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-6 mt-16">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Edit Alat Musik</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Nama alat musik" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
              <input 
                type="text" 
                id="type"
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Gitar, Piano, dll." 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Merek</label>
              <input 
                type="text" 
                id="brand"
                name="brand" 
                value={formData.brand} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Merek pembuat" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
              <input 
                type="number" 
                id="stock"
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                placeholder="Jumlah tersedia" 
                required 
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-1">Harga per Hari</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
                <input 
                  type="number" 
                  id="pricePerDay"
                  name="pricePerDay" 
                  value={formData.pricePerDay} 
                  onChange={handleChange} 
                  className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Harga sewa harian" 
                  required 
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
              <select 
                id="condition"
                name="condition" 
                value={formData.condition} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                required
              >
                <option value="new">Baru</option>
                <option value="good">Baik</option>
                <option value="fair">Cukup</option>
                <option value="damaged">Rusak</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
                {categoriesLoading && (
                  <span className="ml-2 text-xs text-gray-500">(Memuat...)</span>
                )}
              </label>
              {categories.length > 0 ? (
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-gray-100 rounded-md text-gray-500">
                  {categoriesLoading ? 'Memuat kategori...' : 'Tidak ada kategori tersedia'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea 
            id="description"
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
            placeholder="Deskripsi detail alat musik"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Gambar Alat Musik</label>
          <div className="flex flex-col items-center space-y-4">
            {imagePreview && (
              <div className="mt-2 relative">
                <img 
                  src={imagePreview} 
                  alt="Preview gambar" 
                  className="h-48 w-full object-cover rounded-lg shadow-md" 
                />
              </div>
            )}
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-md tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-50 transition">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"/>
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z"/>
              </svg>
              <span className="mt-2 text-base text-blue-600">Pilih Gambar</span>
              <input 
                type="file" 
                id="image" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <button 
            type="button" 
            onClick={() => navigate("/instrument-list")} 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInstrument;