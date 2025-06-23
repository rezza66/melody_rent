import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { getUser, updateUserProfile } from '../redux/userSlice';
import { IMAGE_BASE_URL } from '../utils/config';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  image: File | string;
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    image: '',
  });

  const [previewImage, setPreviewImage] = useState<string>('/default-avatar.png');

  // 🔥 Panggil `getUser()` saat halaman dimuat
  useEffect(() => {
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  // 🔥 Set formData ketika user tersedia
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        image: user.image || '',
      });

      setPreviewImage(user.image ? `${IMAGE_BASE_URL}/${user.image}` : '/default-avatar.png');
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prevState => ({
        ...prevState,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPreviewImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!user || !user._id) {
      alert("User tidak ditemukan. Silakan login ulang.");
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
  
      // Dispatch Redux action dengan userId
      await dispatch(updateUserProfile({ userId: user._id, formData: formDataToSend })).unwrap();
      alert('Profil berhasil diperbarui');
    } catch (error: any) {
      alert(`Gagal memperbarui profil: ${error.message || "Terjadi kesalahan"}`);
    }
  
    setIsEditing(false);
  };
  
  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Memuat profil...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">Terjadi kesalahan: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 mt-24 mb-24">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">Profil Pengguna</h1>
          <p className="opacity-80">Kelola informasi akun Anda</p>
        </div>
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4">
                  <img src={previewImage} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-gray-100 shadow-md" />
                  {isEditing && (
                    <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-700 transition">
                      <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    {isEditing ? (
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                    ) : (
                      <p className="text-gray-800 font-medium">{user?.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-800 font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                    {isEditing ? (
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                    ) : (
                      <p className="text-gray-800 font-medium">{user?.phone}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                    {isEditing ? (
                      <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                    ) : (
                      <p className="text-gray-800 font-medium">{user?.address}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end pt-4 mt-6 border-t border-gray-100">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 mr-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                        Batal
                      </button>
                      <button type="submit" className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition">
                        Simpan Perubahan
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition">
                      Edit Profil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
