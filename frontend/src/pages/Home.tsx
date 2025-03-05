import React, { useState } from 'react';
import { Search } from 'lucide-react';

type Instrument = {
  _id?: string;
  name: string;
  type: string;
  brand?: string;
  stock: number;
  pricePerDay: number;
  description?: string;
  image?: string;
  condition: "new" | "good" | "fair" | "damaged";
  available: boolean;
  createdAt: Date;
};

const instrumentData: Instrument[] = [
  {
    _id: "1",
    name: 'Gitar Elektrik Yamaha Pacifica',
    type: 'gitar',
    brand: 'Yamaha',
    stock: 5,
    pricePerDay: 75000,
    description: 'Gitar elektrik berkualitas tinggi dengan pickup premium, cocok untuk berbagai genre musik.',
    image: '/api/placeholder/300/200',
    condition: 'good',
    available: true,
    createdAt: new Date()
  },
  {
    _id: "2",
    name: 'Drum Elektronik Roland TD-17',
    type: 'drum',
    brand: 'Roland',
    stock: 3,
    pricePerDay: 250000,
    description: 'Drum elektronik dengan modul canggih, suara realistis, dan fitur pelatihan built-in.',
    image: '/api/placeholder/300/200',
    condition: 'new',
    available: true,
    createdAt: new Date()
  },
  {
    _id: "3",
    name: 'Keyboard Casio',
    type: 'keyboard',
    brand: 'Casio',
    stock: 2,
    pricePerDay: 100000,
    description: 'Keyboard arranger profesional dengan ribuan style dan fitur komposisi musik.',
    image: '/api/placeholder/300/200',
    condition: 'good',
    available: false,
    createdAt: new Date()
  }
];

const Homepage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Semua');

  const instrumentTypes = ['Semua', 'gitar', 'drum', 'keyboard'];

  const filteredInstruments = instrumentData.filter(instrument => 
    (searchTerm === '' || instrument.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedType === 'Semua' || instrument.type === selectedType)
  );

  return (
    <div className="min-h-screen bg-gray-100 mt-16 p-6">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Rental Alat Musik
          </h1>
          <p className="text-gray-600">
            Sewa alat musik berkualitas dengan mudah dan terjangkau
          </p>
        </header>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Search className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Cari instrumen..." 
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-center space-x-4 mb-4">
            {instrumentTypes.map(type => (
              <button
                key={type}
                className={`px-4 py-2 rounded ${
                  selectedType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type === 'Semua' ? 'Semua Tipe' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredInstruments.map(instrument => (
            <div 
              key={instrument._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <img 
                src={instrument.image} 
                alt={instrument.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold mb-2">
                  {instrument.name}
                </h2>
                <p className="text-gray-600 mb-2 flex-grow">
                  {instrument.description}
                </p>
                <div className="mb-2">
                  <span className="text-gray-600">
                    Tipe: {instrument.type.charAt(0).toUpperCase() + instrument.type.slice(1)}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-gray-600">
                    Kondisi: {instrument.condition.charAt(0).toUpperCase() + instrument.condition.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">
                    Rp {instrument.pricePerDay.toLocaleString()}/hari
                  </span>
                  <div>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm ${
                        instrument.available && instrument.stock > 0
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {instrument.available && instrument.stock > 0 
                        ? `Tersedia (${instrument.stock} unit)` 
                        : 'Tidak Tersedia'}
                    </span>
                  </div>
                </div>
                <button 
                  disabled={!instrument.available || instrument.stock === 0}
                  className={`w-full mt-4 py-2 rounded ${
                    instrument.available && instrument.stock > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {instrument.available && instrument.stock > 0 
                    ? 'Sewa Sekarang' 
                    : 'Tidak Dapat Disewa'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;