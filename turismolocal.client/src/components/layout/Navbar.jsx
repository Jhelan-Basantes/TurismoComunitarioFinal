// src/components/layout/Navbar.jsx
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

function Navbar({ toggleTheme, modoOscuro }) {
    const navigate = useNavigate();
    const { usuario, logout } = useContext(AuthContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    void isMobile;

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
        { label: 'Inicio', path: '/' },
        { label: 'Catálogo', path: '/catalogo' },
        ...(usuario ? [
            { label: 'Reservas', path: '/reservas' },
            { label: 'Mis Destinos', path: '/ver-reservas' },
            { label: 'Perfil', path: '/perfil' },
            { label: 'Favoritos', path: '/wishlist' },
        ] : []),
        ...(!usuario ? [
            { label: 'Iniciar Sesión', path: '/login' },
            { label: 'Registrarse', path: '/registro' }
        ] : []),
        ...(usuario && ['Administrador', 'Guia'].includes(usuario.role)
            ? [{ label: 'Agregar Lugar', path: '/agregar-lugar' }]
            : []),
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
                    transition: 'background-color 0.3s ease',
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
                        <Button color="inherit" onClick={() => handleNav('/')}>Inicio</Button>
                        <Button color="inherit" onClick={() => handleNav('/catalogo')}>Catálogo</Button>

                        {usuario && (
                            <>
                                <Button color="inherit" onClick={() => handleNav('/reservas')}>Reservas</Button>
                                <Button color="inherit" onClick={() => handleNav('/ver-reservas')}>Mis Destinos</Button>
                                <Button color="inherit" onClick={() => handleNav('/perfil')}>Perfil</Button>
                                <Button color="inherit" onClick={() => handleNav('/wishlist')}>Favoritos</Button>
                            </>
                        )}

                        {!usuario ? (
                            <>
                                <Button color="inherit" onClick={() => handleNav('/login')}>Login</Button>
                                <Button color="inherit" onClick={() => handleNav('/registro')}>Registro</Button>
                            </>
                        ) : (
                            <Button color="inherit" onClick={logout}>Salir</Button>
                        )}

                        {usuario && ['Administrador', 'Guia'].includes(usuario.role) && (
                            <Button color="inherit" onClick={() => handleNav('/agregar-lugar')}>
                                Agregar Lugar
                            </Button>
                        )}

                        <Tooltip title="Cambiar tema">
                            <IconButton onClick={toggleTheme} color="inherit">
                                {modoOscuro ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Favoritos">
                            <IconButton color="inherit" onClick={() => handleNav('/wishlist')}>
                                <FavoriteIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Acceso">
                            <IconButton color="inherit" onClick={() => handleNav(usuario ? '/perfil' : '/login')}>
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

            <Toolbar />
        </>
    );
}

export default Navbar;
