import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika pengiriman pesan
    alert('Pesan terkirim!');
    setFormData({ nama: '', email: '', pesan: '' });
  };

  return (
    <div className="container mx-auto px-4 mt-22">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Hubungi Kami
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulir Kontak */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nama</label>
              <input 
                type="text" 
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Pesan</label>
              <textarea 
                name="pesan"
                value={formData.pesan}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md h-32"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Kirim Pesan
            </button>
          </form>
        </div>

        {/* Informasi Kontak */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Informasi Kontak</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <MapPin className="text-blue-600" size={30} />
              <div>
                <h3 className="font-semibold">Alamat</h3>
                <p className="text-gray-600">Jl. Musik Raya No. 123, Jakarta</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Phone className="text-blue-600" size={30} />
              <div>
                <h3 className="font-semibold">Telepon</h3>
                <p className="text-gray-600">+62 812-4889-3567</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Mail className="text-blue-600" size={30} />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">rezap9303@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Jam Operasional</h3>
            <p className="text-gray-600">
              Senin - Jumat: 09.00 - 18.00 WIB<br />
              Sabtu: 10.00 - 15.00 WIB<br />
              Minggu & Hari Libur: Tutup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;