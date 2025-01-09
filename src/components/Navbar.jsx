import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
          Financify
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
               <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" > Dashboard </Link>
               <Link to="/form" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" > Form </Link>
                <button onClick={logout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div> 
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors" > Login </Link>
                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" > Register </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
