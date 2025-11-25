import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

// Layouts
import MainLayout from './components/layout/MainLayout';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Login from './components/pages/Login';
import Appointment from './components/pages/Appointment';
import AppointmentList from './components/pages/AppointmentList';
import Cart from './components/pages/Cart';
import ProductAdmin from './components/pages/ProductAdmin';
import Products from './components/pages/Products';
import ProductCreate from './components/pages/ProductCreate';
import AdminDashboard from './components/pages/AdminDashboard';
import Checkout from './components/pages/Checkout';
import Orders from './components/pages/Orders';
import Profile from './components/pages/Profile';
import ProductDetail from './components/pages/ProductDetail';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}> 
              <Route index element={<Home />} />
              <Route path="nosotros" element={<About />} />
              <Route path="contacto" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="citas" element={<Appointment />} />
              <Route path="citas-agendadas" element={<AppointmentList />} />
              <Route path="carrito" element={<Cart />} />
              <Route path="productos" element={<Products />} />
              <Route path="productos/:id" element={<ProductDetail />} />
              <Route path="productos/nuevo" element={<ProductCreate />} />
              <Route path="catalogo" element={<Products />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="pedidos" element={<Orders />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
