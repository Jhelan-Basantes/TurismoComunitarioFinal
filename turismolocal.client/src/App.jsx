/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025  
 * 
 * Descripción general:
 * Componente raíz de la aplicación que configura el enrutamiento usando React Router.
 * 
 * Funcionalidades principales:
 * - Define las rutas públicas y privadas de la aplicación.
 * - Protege rutas sensibles mediante componentes PrivateRoute y RoleRoute, 
 *   los cuales verifican la autenticación y los roles de usuario almacenados en localStorage.
 * - Integra los contextos globales AuthProvider (para autenticación) y ThemeContextProvider (para temas).
 * - Las rutas públicas incluyen páginas como Home, Login, Registro y Detalle de Lugar.
 * - Las rutas privadas requieren que el usuario esté autenticado, incluyendo Reservas, Perfil, Wishlist, Pagos, entre otras.
 * - Algunas rutas privadas están restringidas a roles específicos (Administrador y Guía) para acciones como agregar lugares.
 * 
 * Uso:
 * Importa y monta los componentes de página según la URL usando el sistema de rutas declarativo de React Router.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas
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

// Contextos
import { AuthProvider } from './context/AuthContext';
import ThemeContextProvider from './context/ThemeContext';

function PrivateRoute({ children }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    return usuario ? children : <Login />;
}

function RoleRoute({ children, allowedRoles }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    return usuario && allowedRoles.includes(usuario.role) ? children : <Login />;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeContextProvider>
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
                </ThemeContextProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
