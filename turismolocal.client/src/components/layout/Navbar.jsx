/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente Navbar representa la barra de navegación principal de la aplicación.
 * Muestra opciones dinámicas según el estado de autenticación del usuario y su rol (turista o guía),
 * además de incluir accesos a funcionalidades clave como perfil, wishlist, reservas, cambio de tema
 * y navegación responsiva (menú tipo Drawer en dispositivos móviles).
 * Implementado con React, React Router y MUI (Material UI) para una experiencia moderna y adaptable.
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

/**
 * Componente Navbar
 * 
 * Props:
 * - toggleTheme: función que cambia entre modo claro y oscuro.
 * - modoOscuro: booleano que indica si el tema actual es oscuro.
 */
function Navbar({ toggleTheme, modoOscuro }) {
    const navigate = useNavigate();
    const { usuario, logout } = useContext(AuthContext); // Accede a datos de autenticación global
    const [mobileOpen, setMobileOpen] = useState(false); // Controla apertura del menú lateral móvil
    const [scrolled, setScrolled] = useState(false); // Estado visual al hacer scroll
    const theme = useTheme(); // Accede al tema MUI
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detecta vista móvil

    // Efecto para cambiar estilo de la AppBar cuando se hace scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navega a una ruta específica y cierra el menú móvil si está abierto
    const handleNav = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    // Ítems del Drawer (menú lateral), varían según autenticación y rol del usuario
    const drawerItems = [
        { label: 'Catálogo', path: '/catalogo' },
        ...(usuario ? [
            { label: 'Reservar', path: '/reservas' },
            { label: 'Mis Destinos', path: '/ver-reservas' },
            ...(usuario.role === 'Guia'
                ? [{ label: 'Lugares', path: '/agregar-lugar' }]
                : [])
        ] : []),
        ...(!usuario ? [
            { label: 'Iniciar Sesión', path: '/login' },
            { label: 'Registrarse', path: '/registro' }
        ] : []),
    ];

    return (
        <>
            {/* AppBar fija en la parte superior, con cambio de elevación según scroll */}
            <AppBar
                position="fixed"
                elevation={scrolled ? 4 : 0}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    px: 2,
                    transition: 'background-color 0.3s ease',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Logo/Navegación principal */}
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', fontFamily: 'inherit', cursor: 'pointer' }}
                        onClick={() => handleNav('/')}
                    >
                        TurismoLocal
                    </Typography>

                    {/* Botones para vista de escritorio */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        <Button color="inherit" onClick={() => handleNav('/catalogo')}>Catálogo</Button>

                        {usuario && (
                            <>
                                <Button color="inherit" onClick={() => handleNav('/reservas')}>Reservar</Button>
                                <Button color="inherit" onClick={() => handleNav('/ver-reservas')}>Mis Destinos</Button>
                                {usuario.role === 'Guia' && (
                                    <Button color="inherit" onClick={() => handleNav('/agregar-lugar')}>
                                        Lugares
                                    </Button>
                                )}
                            </>
                        )}

                        {/* Botón para cambiar entre modo claro/oscuro */}
                        <Tooltip title="Cambiar tema">
                            <IconButton onClick={toggleTheme} color="inherit">
                                {modoOscuro ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>

                        {/* Acceso a favoritos (wishlist) */}
                        <Tooltip title="Favoritos">
                            <IconButton
                                color="inherit"
                                onClick={() => handleNav(usuario ? '/wishlist' : '/login')}
                            >
                                <FavoriteIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Acceso al perfil (o login si no autenticado) */}
                        <Tooltip title="Acceso">
                            <IconButton
                                color="inherit"
                                onClick={() => handleNav(usuario ? '/perfil' : '/login')}
                            >
                                <AccountCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Icono de menú hamburguesa para vista móvil */}
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

            {/* Drawer para navegación en dispositivos móviles */}
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

            {/* Añade espacio equivalente a la altura del AppBar para evitar solapamiento */}
            <Toolbar />
        </>
    );
}

export default Navbar;
