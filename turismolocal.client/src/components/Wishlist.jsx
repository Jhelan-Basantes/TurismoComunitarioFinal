import React, { useState, useEffect, useContext } from 'react';
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
    const { usuario } = useContext(AuthContext);
    const usuarioId = usuario?.id;
    const esAdminOGuia = usuario?.role === 'Administrador' || usuario?.role === 'Guia';

    const [lugares, setLugares] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [calificaciones, setCalificaciones] = useState({});
    const [wishlist, setWishlist] = useState([]);

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

    const verDetalle = (id) => navigate(`/lugar/${id}`);

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

    const eliminarLugar = (id) => {
        alert(`Eliminar lugar con ID ${id} (funcionalidad no implementada aquí)`);
    };

    // 🔍 Filtrar por texto Y que esté en la wishlist
    const lugaresFiltrados = lugares.filter(lugar =>
        wishlist.includes(lugar.id) &&
        (lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            lugar.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <Box sx={{ px: 4, py: 6 }}>
            <Typography variant="h4" gutterBottom align="center">
                Mis Lugares Favoritos
            </Typography>

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

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                                            <Typography variant="body2">${lugar.precio}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="body2">
                                                    {calificaciones[lugar.id]?.toFixed(1) ?? '0.0'}
                                                </Typography>
                                                <StarIcon fontSize="small" color="warning" />
                                            </Box>
                                        </Box>

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

export default Wishlist;
