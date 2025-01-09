import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  // if (!user) {
  //   return (
  //     <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
  //       <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
  //       <p className="text-gray-600">Please log in to view your dashboard.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <div className="space-y-4">
        {/* <p className="text-gray-600">
          You're logged in as <span className="font-semibold">{user.name}</span>
        </p>
        <p className="text-gray-600">
          Email: <span className="font-semibold">{user.email}</span>
        </p> */}
      </div>
    </div>
  );
};

export default Home;
