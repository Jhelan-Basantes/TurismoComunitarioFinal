// src/App.jsx
import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Catalogo from './components/Catalogo';
import Login from './components/Login';
import Registro from './components/Registro';
import LugarDetalle from './components/LugarDetalle';
import Reservas from './components/Reservas';
import VerReservas from './components/VerReservas';
import AgregarLugar from './components/AgregarLugar';
import Pagos from './components/Pagos';
import Perfil from './components/Perfil';
import Wishlist from './components/Wishlist';

import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';

function PrivateRoute({ children }) {
    const { usuario } = useContext(AuthContext);
    return usuario ? children : <Login />;
}

function RoleRoute({ children, allowedRoles }) {
    const { usuario } = useContext(AuthContext);
    if (!usuario || !allowedRoles.includes(usuario.role)) {
        return <Login />;
    }
    return children;
}

function AppContent({ toggleTheme, modoOscuro }) {
    return (
        <div className="app-container">
            <Navbar toggleTheme={toggleTheme} modoOscuro={modoOscuro} />
            <main className="main-content-area" style={{ padding: '1rem', minHeight: 'calc(100vh - 128px)' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/agregar-lugar" element={
                        <RoleRoute allowedRoles={["Administrador", "Guia"]}>
                            <AgregarLugar />
                        </RoleRoute>
                    } />
                    <Route path="/reservas" element={<PrivateRoute><Reservas /></PrivateRoute>} />
                    <Route path="/ver-reservas" element={<PrivateRoute><VerReservas /></PrivateRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/lugar/:id" element={<LugarDetalle />} />
                    <Route path="/pagos" element={<PrivateRoute><Pagos /></PrivateRoute>} />
                    <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
                    <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

function App() {
    const [modoOscuro, setModoOscuro] = useState(false);
    const toggleTheme = () => setModoOscuro(prev => !prev);

    return (
        <ThemeProvider theme={modoOscuro ? darkTheme : lightTheme}>
            <CssBaseline />
            <AppContent toggleTheme={toggleTheme} modoOscuro={modoOscuro} />
        </ThemeProvider>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    );
}
