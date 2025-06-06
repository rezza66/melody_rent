import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getAllUser } from '../../redux/userSlice';
import Sidebar from '../../components/Sidebar';
import { deleteUser } from '../../redux/userSlice';
import { IMAGE_BASE_URL } from '../../utils/config';

interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  role?: string;
}

const UserList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const [activeMenu, setActiveMenu] = useState('Pengguna');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const handleDelete = async (userId: string | undefined) => {
    if (!userId) {
      console.error('No user ID provided');
      return;
    }

    try {
      setIsDeleting(true);
      // Using deleteInstrument action from instrumentSlice
      await dispatch(deleteUser(userId)).unwrap();
      
      // Refresh the user list after successful deletion
      dispatch(getAllUser());
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setIsDeleting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <div className="w-full md:ml-64 min-h-screen bg-gray-100 mt-12 p-4 md:p-6 pt-20 md:pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <div className="w-full md:ml-64 min-h-screen bg-gray-100 mt-12 p-4 md:p-6 pt-20 md:pt-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <div className="w-full md:ml-64 min-h-screen bg-gray-100 mt-12 p-4 md:p-6 pt-20 md:pt-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  {users.some(user => user.role) && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: User) => (
                  <tr key={user.id || user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.image ? (
                        <img 
                          src={`${IMAGE_BASE_URL}/${user.image}`} 
                          alt={user.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{user.address}</div>
                    </td>
                    {user.role && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className={`text-red-600 hover:text-red-900 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleDelete(user.id || user._id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;