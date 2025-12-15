import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import PlaceOrder from './pages/PlaceOrder';
import MyOrders from './pages/MyOrders';
import ProductDetails from './pages/ProductDetails';
import UserProfile from './pages/UserProfile';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Cart from './pages/Cart';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Navbar />
            <Toaster position="top-center" reverseOrder={false} />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/placeorder" element={<PlaceOrder />} />
                <Route path="/myorders" element={<MyOrders />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
