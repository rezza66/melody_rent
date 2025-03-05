import React from 'react';
import { Music, CheckCircle, Star } from 'lucide-react';

const AboutPage: React.FC = () => {
  const keunggulan = [
    {
      icon: <Music className="text-blue-600" size={40} />,
      judul: 'Koleksi Terlengkap',
      deskripsi: 'Kami menyediakan berbagai macam alat musik berkualitas dari merek terkemuka.'
    },
    {
      icon: <CheckCircle className="text-green-600" size={40} />,
      judul: 'Mudah & Transparan',
      deskripsi: 'Proses sewa yang sederhana dan biaya yang jelas tanpa biaya tersembunyi.'
    },
    {
      icon: <Star className="text-yellow-600" size={40} />,
      judul: 'Kualitas Terjamin',
      deskripsi: 'Semua alat musik kami rutin dikalibrasi dan dalam kondisi prima.'
    }
  ];

  return (
    <div className="container mx-auto px-4 mt-22">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Tentang RentMusik
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          RentMusik adalah platform penyewaan alat musik terdepan yang memudahkan musisi dan pecinta musik untuk menyewa alat musik berkualitas dengan mudah dan terjangkau.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {keunggulan.map((item, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-md text-center transform transition hover:scale-105"
          >
            <div className="flex justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.judul}</h3>
            <p className="text-gray-600">{item.deskripsi}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Misi Kami
        </h2>
        <p className="text-gray-700 text-center max-w-2xl mx-auto">
          Kami berkomitmen untuk menghubungkan musisi dengan alat musik berkualitas, 
          memfasilitasi kreativitas dan passion mereka tanpa hambatan biaya atau kepemilikan.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;