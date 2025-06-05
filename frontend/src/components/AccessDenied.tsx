import React from "react";
import { XCircle, ArrowLeft } from "lucide-react";

const AccessDenied: React.FC = () => {
  const handleGoBack = (): void => {
    window.history.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <XCircle className="mx-auto text-red-500 w-24 h-24 mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
        <p className="text-xl text-gray-600 mb-8">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
