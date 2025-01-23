import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AssetForm from './pages/Form';
import Investments from './pages/Investments';

// In index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} /> */}
              <Route path="/" element={ <Home/>} />
              <Route path="/dashboard" element={ <PrivateRoute> <Dashboard/> </PrivateRoute> } />
              <Route path="/form" element={ <PrivateRoute> <AssetForm/> </PrivateRoute> } />
              <Route path="/investments" element={ <PrivateRoute> <Investments/> </PrivateRoute> } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
