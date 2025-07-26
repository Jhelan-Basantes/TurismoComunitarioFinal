/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025  
 * 
 * Descripción general:
 * Componente que muestra la lista de lugares favoritos (wishlist) del usuario autenticado.
 * 
 * Funcionalidades:
 * - Carga todos los lugares disponibles y las calificaciones promedio de cada uno desde la API.
 * - Obtiene la lista de favoritos del usuario y permite filtrar la lista mediante búsqueda.
 * - Permite agregar o quitar lugares de la wishlist con actualización directa al backend.
 * - Muestra información relevante de cada lugar: imagen, nombre, descripción breve, precio y calificación promedio.
 * - Permite a usuarios con rol Administrador o Guía eliminar lugares (funcionalidad pendiente de implementar).
 * - Incluye manejo de errores y mensajes informativos para mejor experiencia de usuario.
 */


import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/layout/Layout';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    InputBase,
    IconButton,
    Alert,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Wishlist() {
    const navigate = useNavigate();
    const { usuario } = useContext(AuthContext); // Accede al usuario autenticado
    const usuarioId = usuario?.id;
    const esAdminOGuia = usuario?.role === 'Administrador' || usuario?.role === 'Guia';

    // Estados para manejar la información y errores
    const [lugares, setLugares] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [calificaciones, setCalificaciones] = useState({});
    const [wishlist, setWishlist] = useState([]);
    const [error, setError] = useState('');

    // useEffect para cargar datos desde la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Carga todos los lugares disponibles
                const lugaresRes = await fetch('https://localhost:7224/api/lugares');
                if (!lugaresRes.ok) throw new Error('Error al cargar lugares');
                const lugaresData = await lugaresRes.json();
                setLugares(lugaresData);

                // Carga promedios de calificaciones por lugar
                const calificacionesRes = await fetch('https://localhost:7224/api/opiniones/promedios');
                if (!calificacionesRes.ok) throw new Error('Error al cargar calificaciones');
                const calificacionesData = await calificacionesRes.json();
                setCalificaciones(calificacionesData);

                // Carga el array de lugares favoritos del usuario
                if (usuarioId) {
                    const usuarioRes = await fetch(`https://localhost:7224/api/usuarios/${usuarioId}`, {
                        headers: { Authorization: `Bearer ${usuario.token}` }
                    });
                    if (!usuarioRes.ok) throw new Error('Error al cargar wishlist');
                    const usuarioData = await usuarioRes.json();
                    const parsed = JSON.parse(usuarioData.wishlist || '[]');
                    setWishlist(Array.isArray(parsed) ? parsed : []);
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchData();
    }, [usuarioId, usuario]);

    // Redirige al detalle de un lugar
    const verDetalle = (id) => navigate(`/lugar/${id}`);

    // Agrega o remueve un lugar de la wishlist del usuario
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
                body: JSON.stringify({
                    wishlist: JSON.stringify(nuevaWishlist)
                })
            });

            if (!res.ok) throw new Error('Error al actualizar la wishlist');
            setWishlist(nuevaWishlist);
        } catch (err) {
            console.error(err);
        }
    };

    // Placeholder para función de eliminación por admins/guías
    const eliminarLugar = (id) => {
        alert(`Eliminar lugar con ID ${id} (funcionalidad no implementada aquí)`);
    };

    // Aplica filtros de búsqueda dentro de la wishlist del usuario
    const lugaresFiltrados = lugares.filter(lugar =>
        wishlist.includes(lugar.id) &&
        (lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            lugar.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <Layout >
            <Box sx={{ px: 4, py: 6 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Mis Lugares Favoritos
                </Typography>

                {/* Barra de búsqueda */}
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
                        placeholder="Buscar en favoritos"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        sx={{ ml: 1, flex: 1 }}
                    />
                </Box>

                {/* Mensaje de error si falla la carga */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Mensaje si no hay resultados en favoritos */}
                {lugaresFiltrados.length === 0 ? (
                    <Alert severity="info">No hay lugares favoritos que coincidan con "{busqueda}"</Alert>
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
                                        {/* Botón para agregar o quitar de favoritos */}
                                        <IconButton
                                            onClick={() => handleWishlist(lugar.id)}
                                            sx={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                zIndex: 2,
                                            }}
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

                                        {/* Contenido del lugar */}
                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                                            <Typography variant="h6">{lugar.nombre}</Typography>

                                            {/* Descripción truncada con gradiente */}
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

                                            {/* Botones de acción */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => verDetalle(lugar.id)}
                                                >
                                                    Ver más
                                                </Button>

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
        </Layout >
    );
}

export default Wishlist;
