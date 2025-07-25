/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente centraliza la estructura de navegación y configuración global de la aplicación "Turismo Comunitario".
 * Implementa el sistema de rutas mediante React Router, integra los temas claros y oscuros con Material UI, 
 * y utiliza Context API para el manejo de la autenticación de usuarios.
 */

import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importación de páginas principales
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

// Contexto de autenticación
import { AuthContext, AuthProvider } from './context/AuthContext';

// Componentes de diseño general
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Configuración de temas de Material UI
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

// Tipografía global (Poppins)
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';

/**
 * Componente para proteger rutas privadas (solo accesibles si el usuario está autenticado).
 */
function PrivateRoute({ children }) {
    const { usuario } = useContext(AuthContext);
    return usuario ? children : <Login />;
}

/**
 * Componente para proteger rutas basadas en roles (Administrador, Guía, etc.).
 */
function RoleRoute({ children, allowedRoles }) {
    const { usuario } = useContext(AuthContext);
    if (!usuario || !allowedRoles.includes(usuario.role)) {
        return <Login />;
    }
    return children;
}

/**
 * Componente principal del contenido de la aplicación, contiene:
 * - Navbar
 * - Rutas definidas
 * - Footer
 * Recibe el estado y función para alternar entre temas claro/oscuro.
 */
function AppContent({ toggleTheme, modoOscuro }) {
    return (
        <div className="app-container">
            <Navbar toggleTheme={toggleTheme} modoOscuro={modoOscuro} />
            <main
                className="main-content-area"
                style={{ padding: '1rem', minHeight: 'calc(100vh - 128px)' }}
            >
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

/**
 * Componente de nivel superior que gestiona el tema de la app.
 * Provee alternancia entre modo claro y oscuro.
 */
function App() {
    const [modoOscuro, setModoOscuro] = useState(false);

    // Alterna entre el tema claro y oscuro
    const toggleTheme = () => setModoOscuro(prev => !prev);

    return (
        <ThemeProvider theme={modoOscuro ? darkTheme : lightTheme}>
            <CssBaseline /> {/* Normaliza el estilo base según el tema */}
            <AppContent toggleTheme={toggleTheme} modoOscuro={modoOscuro} />
        </ThemeProvider>
    );
}

/**
 * Punto de entrada final de la aplicación.
 * Envueltura con Router y proveedor de autenticación global.
 */
export default function AppWrapper() {
    return (
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    );
}
