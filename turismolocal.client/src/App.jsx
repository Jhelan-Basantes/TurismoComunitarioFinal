import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import Catalogo from './components/Catalogo';
import Login from './components/Login';
import Registro from './components/Registro'; 
import LugarDetalle from './components/LugarDetalle';
import Reservas from './components/Reservas';
import VerReservas from './components/VerReservas';

import { AuthContext, AuthProvider } from './context/AuthContext';

function PrivateRoute({ children }) {
    const { username } = useContext(AuthContext);
    return username ? children : <Login />;
}

function App() {
    const { username, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <nav
                style={{
                    width: '100%',
                    height: '60px',
                    backgroundColor: '#343a40',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1000
                }}
            >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
                        Turismo Local
                    </Link>

                    <Link to="/catalogo" style={{ color: 'white', textDecoration: 'none' }}>
                        Catálogo
                    </Link>
                    <Link to="/reservas" style={{ color: 'white', textDecoration: 'none' }}>
                        Reservas
                    </Link>
                    <Link to="/ver-reservas" style={{ color: 'white', textDecoration: 'none' }}>
                        Ver Reservas
                    </Link>
                    <Link to="/registro" style={{ color: 'white', textDecoration: 'none' }}>
                        Registrarse
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {username && (
                        <span style={{ fontSize: '14px', color: '#ccc' }}>Usuario: {username}</span>
                    )}

                    {username ? (
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid #ccc',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </nav>

            <main
                style={{
                    marginTop: '70px',
                    minHeight: 'calc(100vh - 90px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '20px'
                }}
            >
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalogo" element={<Catalogo />} />
                        {/* Rutas protegidas usando PrivateRoute */}
                        <Route path="/reservas" element={
                            <PrivateRoute>
                                <Reservas />
                            </PrivateRoute>
                        } />
                        <Route path="/ver-reservas" element={
                            <PrivateRoute>
                                <VerReservas />
                            </PrivateRoute>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} /> 
                        <Route path="/lugar/:id" element={<LugarDetalle />} />
                    </Routes>
                </div>
            </main>
        </div>
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
