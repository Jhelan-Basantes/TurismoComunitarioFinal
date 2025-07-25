/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente renderiza el catálogo de lugares turísticos disponibles. 
 * Permite a los usuarios visualizar, buscar y marcar lugares como favoritos. 
 * Los administradores y guías pueden también eliminar lugares (funcionalidad pendiente). 
 * Se conecta con la API para obtener los lugares, las calificaciones promedio y 
 * la wishlist personalizada del usuario autenticado.
 */

import React, { useState, useEffect, useContext } from 'react';
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

    // Estado para almacenar los lugares turísticos
    const [lugares, setLugares] = useState([]);

    // Estado para controlar la búsqueda en tiempo real
    const [busqueda, setBusqueda] = useState('');

    // Diccionario con las calificaciones promedio de cada lugar
    const [calificaciones, setCalificaciones] = useState({});

    // Lista de IDs de lugares marcados como favoritos
    const [wishlist, setWishlist] = useState([]);

    /**
     * useEffect que realiza múltiples solicitudes:
     * - Carga la lista completa de lugares desde la API
     * - Carga las calificaciones promedio de cada lugar
     * - Si hay usuario autenticado, recupera su wishlist
     */
    useEffect(() => {
        fetch('https://localhost:7224/api/lugares')
            .then(res => res.ok ? res.json() : Promise.reject('Error al cargar lugares'))
            .then(setLugares)
            .catch(console.error);

        fetch('https://localhost:7224/api/opiniones/promedios')
            .then(res => res.ok ? res.json() : Promise.reject('Error al cargar calificaciones'))
            .then(setCalificaciones)
            .catch(console.error);

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

    // Navega al detalle del lugar seleccionado
    const verDetalle = (id) => navigate(`/lugar/${id}`);

    /**
     * Permite al usuario agregar o quitar un lugar de su wishlist.
     * Actualiza tanto el estado local como la base de datos mediante una solicitud PUT.
     */
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

    /**
     * Placeholder de eliminación (función aún no implementada).
     * Solo visible para administradores o guías.
     */
    const eliminarLugar = (id) => {
        alert(`Eliminar lugar con ID ${id} (funcionalidad no implementada aquí)`);
    };

    // Filtrado de lugares según coincidencia con nombre o descripción
    const lugaresFiltrados = lugares.filter(lugar =>
        lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        lugar.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Box sx={{ px: 4, py: 6 }}>
            <Typography variant="h4" gutterBottom align="center">
                Catálogo de Lugares
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
                    placeholder="Buscar lugar"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    sx={{ ml: 1, flex: 1 }}
                />
            </Box>

            {/* Alerta si no se encuentran resultados */}
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
                                    {/* Botón para agregar/quitar de favoritos */}
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

                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                                        <Typography variant="h6">{lugar.nombre}</Typography>

                                        {/* Descripción truncada con efecto fade */}
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

                                        {/* Acciones: Ver más / Eliminar */}
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
    );
}

export default Catalogo;
