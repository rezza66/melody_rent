import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchLoans, Loan } from '../../api/loanApi';
import { differenceInDays, format } from 'date-fns';
import axios from 'axios';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const LoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string>("Peminjaman");

  const fetchLoansData = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await fetchLoans(page, pagination.itemsPerPage);
      setLoans(response.data);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalItems: response.pagination.totalItems,
        itemsPerPage: response.pagination.itemsPerPage
      });
      setError(null);
    } catch (err) {
      let message = 'Failed to fetch loans';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.itemsPerPage]);

  useEffect(() => {
    fetchLoansData();
  }, [fetchLoansData]);

  const calculateDaysRemaining = (endDate: string): number => {
    return differenceInDays(new Date(endDate), new Date());
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLoansData(newPage);
    }
  };

  if (isLoading && loans.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading loan data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button 
          onClick={() => fetchLoansData()} 
          className="mt-2 text-sm text-red-800 underline hover:text-red-900"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <div className="w-full md:ml-64 min-h-screen bg-gray-100 mt-12 p-4 md:p-6 pt-20 md:pt-6">
        <h1 className="text-2xl font-bold mb-6">Loan Management</h1>
        
        <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-4">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Instrument
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days Left
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.length > 0 ? (
                loans.map((loan) => {
                  const daysRemaining = calculateDaysRemaining(loan.endDate);
                  const isOverdue = daysRemaining < 0 && loan.status !== 'returned';
                  
                  return (
                    <tr key={loan._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {loan.user?.name || 'Unknown'}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {loan.instrument?.name || 'Unknown'}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        {loan.quantity}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {format(new Date(loan.startDate), 'dd/MM/yyyy')} - {' '}
                        {format(new Date(loan.endDate), 'dd/MM/yyyy')}
                      </td>
                      <td className={`px-5 py-5 border-b border-gray-200 bg-white text-sm text-center ${
                        isOverdue ? 'text-red-600 font-bold' : ''
                      }`}>
                        {isOverdue ? `+${Math.abs(daysRemaining)}` : daysRemaining}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {formatCurrency(loan.totalRentalFee)}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className={`relative inline-block px-3 py-1 font-semibold ${
                          loan.status === 'returned' 
                            ? 'text-green-900 bg-green-200' 
                            : isOverdue 
                              ? 'text-red-900 bg-red-200' 
                              : 'text-yellow-900 bg-yellow-200'
                        } rounded-full`}>
                          {loan.status === 'returned' 
                            ? 'Returned' 
                            : isOverdue 
                              ? 'Overdue' 
                              : 'Ongoing'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                    No loan data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        {pagination.totalItems > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> -{' '}
              <span className="font-medium">
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span>{' '}
              of <span className="font-medium">{pagination.totalItems}</span> results
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`px-4 py-2 border rounded-md ${
                  pagination.currentPage === 1 
                    ? 'bg-gray-100 cursor-not-allowed' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border rounded-md ${
                      pagination.currentPage === pageNum 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-4 py-2 border rounded-md ${
                  pagination.currentPage === pagination.totalPages 
                    ? 'bg-gray-100 cursor-not-allowed' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoansPage;