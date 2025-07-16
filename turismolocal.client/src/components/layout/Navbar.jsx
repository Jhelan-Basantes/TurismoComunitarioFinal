// src/components/layout/Navbar.jsx
import React, { useContext, useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton,
    Drawer, List, ListItem, ListItemText, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { usuario, logout } = useContext(AuthContext);

    const handleNav = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const handlePerfilClick = () => {
        if (usuario) {
            navigate('/perfil');
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const drawerItems = [
        ...(usuario ? [
            { label: 'Reservas', path: '/reservas' },
            { label: 'Mis Destinos', path: '/ver-reservas' },
        ] : []),
        ...(!usuario ? [{ label: 'Iniciar Sesión', path: '/login' }] : []),
        { label: 'Registrarse', path: '/registro' },
        ...(usuario && ['Administrador', 'Guia'].includes(usuario.role)
            ? [{ label: 'Agregar Lugar', path: '/agregar-lugar' }]
            : [])
    ];

    return (
        <>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => handleNav('/')}
                    >
                        Turismo Comunitario
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        <Button color="inherit" onClick={() => handleNav('/catalogo')}>
                            Catálogo
                        </Button>
                    </Box>

                    <Tooltip title="Wishlist">
                        <IconButton color="inherit" onClick={() => handleNav('/wishlist')}>
                            <FavoriteIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Acceso">
                        <IconButton color="inherit" onClick={handlePerfilClick}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Tooltip>

                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            >
                <Box sx={{ width: 250 }}>
                    <List>
                        {drawerItems.map((item) => (
                            <ListItem button key={item.path} onClick={() => handleNav(item.path)}>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                        {usuario && (
                            <ListItem button onClick={handleLogout}>
                                <ListItemText primary="Cerrar Sesión" />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>

            <Toolbar />
        </>
    );
};

export default Navbar;
