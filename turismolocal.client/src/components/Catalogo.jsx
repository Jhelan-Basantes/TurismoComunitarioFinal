/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente `Catalogo.jsx` forma parte del frontend de la aplicación Turismo Comunitario.
 * Se encarga de mostrar un catálogo de lugares turísticos en tarjetas visuales, permitiendo:
 * - Buscar lugares por nombre o descripción.
 * - Visualizar calificaciones promedio.
 * - Agregar o quitar lugares del wishlist personal del usuario autenticado.
 * - Eliminar lugares (para usuarios con rol Administrador o Guía).
 * - Navegar hacia el detalle individual de cada lugar.
 * 
 * Este componente hace uso de React Hooks (`useState`, `useEffect`), contexto de autenticación (`AuthContext`)
 * y Material UI para la interfaz de usuario. 
 */

import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/layout/Layout';
import {
    Box, Grid, Card, CardContent, CardMedia, Typography,
    InputBase, IconButton, Alert, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Catalogo() {
    const navigate = useNavigate();
    const { usuario } = useContext(AuthContext);
    const usuarioId = usuario?.id;
    const esAdminOGuia = usuario?.role === 'Administrador' || usuario?.role === 'Guia';

    // Estados locales
    const [lugares, setLugares] = useState([]);                    // Lista de lugares turísticos
    const [busqueda, setBusqueda] = useState('');                  // Cadena de búsqueda
    const [calificaciones, setCalificaciones] = useState({});      // Diccionario de calificaciones por lugar
    const [wishlist, setWishlist] = useState([]);                  // Lista de IDs favoritos del usuario

    // Cargar datos al montar componente
    useEffect(() => {
        // Obtener lista de lugares
        fetch('https://localhost:7224/api/lugares')
            .then(res => res.ok ? res.json() : Promise.reject('Error al cargar lugares'))
            .then(setLugares)
            .catch(console.error);

        // Obtener calificaciones promedio
        fetch('https://localhost:7224/api/opiniones/promedios')
            .then(res => res.ok ? res.json() : Promise.reject('Error al cargar calificaciones'))
            .then(setCalificaciones)
            .catch(console.error);

        // Obtener wishlist del usuario si ha iniciado sesión
        if (usuarioId) {
            fetch(`https://localhost:7224/api/usuarios/${usuarioId}`, {
                headers: { Authorization: `Bearer ${usuario.token}` }
            })
                .then(res => res.ok ? res.json() : Promise.reject('Error al cargar wishlist'))
                .then(data => {
                    if (data.wishlist) {
                        const parsed = JSON.parse(data.wishlist);
                        setWishlist(Array.isArray(parsed) ? parsed : []);
                    }
                })
                .catch(console.error);
        }
    }, [usuarioId, usuario]);

    // Navegar al detalle del lugar
    const verDetalle = (id) => navigate(`/lugar/${id}`);

    // Agregar o quitar lugar del wishlist
    const handleWishlist = async (lugarId) => {
        if (!usuario) return alert('Debes iniciar sesión');

        const esFavorito = wishlist.includes(lugarId);
        const nuevaWishlist = esFavorito
            ? wishlist.filter(id => id !== lugarId)
            : [...wishlist, lugarId];

        try {
            const res = await fetch(`https://localhost:7224/api/usuarios/${usuarioId}/wishlist`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${usuario.token}`
                },
                body: JSON.stringify({ wishlist: JSON.stringify(nuevaWishlist) })
            });

            if (!res.ok) throw new Error('Error al actualizar la wishlist');
            setWishlist(nuevaWishlist);
        } catch (err) {
            console.error(err);
        }
    };

    // Eliminar lugar (solo admin o guía)
    const eliminarLugar = async (id) => {
        const confirmar = window.confirm('¿Estás seguro de eliminar este lugar?');
        if (!confirmar) return;

        try {
            const res = await fetch(`https://localhost:7224/api/lugares/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${usuario.token}`
                }
            });

            if (!res.ok) throw new Error('Error al eliminar el lugar');

            // Actualizar lista local sin el lugar eliminado
            setLugares(prev => prev.filter(lugar => lugar.id !== id));
        } catch (err) {
            console.error(err);
            alert('No se pudo eliminar el lugar.');
        }
    };

    // Filtrar lugares según búsqueda por nombre o descripción
    const lugaresFiltrados = lugares.filter(lugar =>
        lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        lugar.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Renderizado del catálogo
    return (
        <Layout>
            <Box sx={{ px: 4, py: 6 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Catálogo de Lugares
                </Typography>

                {/* Buscador */}
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f1f1f1',
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: 400,
                        mx: 'auto',
                        px: 2,
                    }}
                >
                    <SearchIcon color="action" />
                    <InputBase
                        placeholder="Buscar lugar"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        sx={{ ml: 1, flex: 1 }}
                    />
                </Box>

                {/* Resultado de la búsqueda */}
                {lugaresFiltrados.length === 0 ? (
                    <Alert severity="info">No se encontraron resultados para "{busqueda}"</Alert>
                ) : (
                    <Grid container spacing={4} justifyContent="center">
                        {lugaresFiltrados.map(lugar => {
                            const isFavorite = wishlist.includes(lugar.id);

                            return (
                                <Grid item key={lugar.id}>
                                    <Card
                                        sx={{
                                            width: 300,
                                            height: 350,
                                            position: 'relative',
                                            boxShadow: 4,
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {/* Botón de favoritos */}
                                        <IconButton
                                            onClick={() => handleWishlist(lugar.id)}
                                            sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
                                            disabled={!usuario}
                                        >
                                            {isFavorite
                                                ? <FavoriteIcon color="error" />
                                                : <FavoriteBorderIcon color="action" />}
                                        </IconButton>

                                        {/* Imagen del lugar */}
                                        {lugar.imagenUrl && (
                                            <CardMedia
                                                component="img"
                                                height="160"
                                                image={lugar.imagenUrl}
                                                alt={`Imagen de ${lugar.nombre}`}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        )}

                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                                            <Typography variant="h6">{lugar.nombre}</Typography>

                                            {/* Descripción truncada */}
                                            <Box sx={{ position: 'relative', height: 60, overflow: 'hidden' }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {lugar.descripcion}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: 30,
                                                        background: 'linear-gradient(to top, white, transparent)',
                                                    }}
                                                />
                                            </Box>

                                            {/* Precio y calificación */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                                                <Typography variant="body2">${lugar.precio}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Typography variant="body2">
                                                        {calificaciones[lugar.id]?.toFixed(1) ?? '0.0'}
                                                    </Typography>
                                                    <StarIcon fontSize="small" color="warning" />
                                                </Box>
                                            </Box>

                                            {/* Acciones: ver más y eliminar */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => verDetalle(lugar.id)}
                                                >
                                                    Ver más
                                                </Button>

                                                {/* Solo visible para administradores o guías */}
                                                {esAdminOGuia && (
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => eliminarLugar(lugar.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Box>
        </Layout>
    );
}

export default Catalogo;
