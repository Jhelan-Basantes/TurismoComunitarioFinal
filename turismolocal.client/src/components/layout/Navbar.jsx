/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
 * Versión: TurismoLocal v10  
 * Fecha: 25/07/2025
 * 
 * Descripción general:
 * Componente `Navbar.jsx` que implementa la barra de navegación principal de la aplicación TurismoLocal.
 * 
 * Funcionalidades principales:
 * - Muestra enlaces de navegación según el estado de autenticación y rol del usuario.
 * - Permite navegar a páginas como Catálogo, Reservar, Mis Destinos, Lugares (solo para Guías), Inicio de sesión y Registro.
 * - Incluye botones para cambiar el tema entre modo claro y oscuro.
 * - Proporciona accesos rápidos a Favoritos y Perfil, o redirige a Login si el usuario no está autenticado.
 * - Adaptación responsiva con menú desplegable tipo Drawer para dispositivos móviles.
 * - Cambia su apariencia (sombra y borde) al hacer scroll para mejorar la visibilidad.
 * - Permite cerrar sesión desde el menú móvil.
 * 
 * Tecnologías y librerías usadas:
 * - React con hooks (`useState`, `useEffect`, `useContext`).
 * - React Router para navegación (`useNavigate`).
 * - Material UI para componentes visuales y estilos responsivos.
 * - Contextos de autenticación (`AuthContext`) y tema (`ThemeContext`).
 * 
 * Este componente es fundamental para la navegación global y la experiencia de usuario,
 * asegurando accesibilidad y personalización según el estado y rol del usuario.
 */

import React, { useContext, useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Drawer, List, ListItem, ListItemText, Tooltip, useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

function Navbar() {
    const navigate = useNavigate();
    const { usuario, logout } = useContext(AuthContext);
    const { modoOscuro, toggleTheme } = useContext(ThemeContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNav = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const drawerItems = [
        { label: 'Catálogo', path: '/catalogo' },
        ...(usuario ? [
            { label: 'Reservar', path: '/reservas' },
            { label: 'Mis Destinos', path: '/ver-reservas' },
            ...(usuario.role === 'Guia' ? [{ label: 'Lugares', path: '/agregar-lugar' }] : [])
        ] : []),
        ...(!usuario ? [
            { label: 'Iniciar Sesión', path: '/login' },
            { label: 'Registrarse', path: '/registro' }
        ] : []),
    ];

    return (
        <>
            <AppBar
                position="fixed"
                elevation={scrolled ? 4 : 0}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    px: 2,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',

                    // sombra clara o borde oscuro según tema
                    boxShadow: !modoOscuro
                        ? '0 2px 6px rgba(0, 0, 0, 0.1)'  // modo claro
                        : 'none',
                    borderBottom: modoOscuro
                        ? '1px solid rgba(255, 255, 255, 0.1)' // modo oscuro
                        : 'none',
                    zIndex: theme.zIndex.drawer + 1
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', fontFamily: 'inherit', cursor: 'pointer' }}
                        onClick={() => handleNav('/')}
                    >
                        TurismoLocal
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <Button color="inherit" onClick={() => handleNav('/catalogo')}>Catálogo</Button>
                        {usuario && (
                            <>
                                <Button color="inherit" onClick={() => handleNav('/reservas')}>Reservar</Button>
                                <Button color="inherit" onClick={() => handleNav('/ver-reservas')}>Mis Destinos</Button>
                                {usuario.role === 'Guia' && (
                                    <Button color="inherit" onClick={() => handleNav('/agregar-lugar')}>Lugares</Button>
                                )}
                            </>
                        )}

                        <Tooltip title="Cambiar tema">
                            <IconButton onClick={toggleTheme} color="inherit">
                                {modoOscuro ? <LightModeIcon /> : <DarkModeIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Favoritos">
                            <IconButton
                                color="inherit"
                                onClick={() => handleNav(usuario ? '/wishlist' : '/login')}
                            >
                                <FavoriteIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Acceso">
                            <IconButton
                                color="inherit"
                                onClick={() => handleNav(usuario ? '/perfil' : '/login')}
                            >
                                <AccountCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <IconButton
                        color="inherit"
                        edge="end"
                        sx={{ display: { md: 'none' } }}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
                <Box sx={{ width: 250 }}>
                    <List>
                        {drawerItems.map((item) => (
                            <ListItem button key={item.path} onClick={() => handleNav(item.path)}>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                        {usuario && (
                            <ListItem button onClick={logout}>
                                <ListItemText primary="Cerrar Sesión" />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>

            {/* Espaciador para compensar altura de navbar fijo */}
            <Toolbar />
        </>
    );
}

export default Navbar;