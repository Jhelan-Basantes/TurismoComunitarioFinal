import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Carousel from 'react-bootstrap/Carousel';
import {
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Typography,
    Autocomplete,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Home() {
    const [lugares, setLugares] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [seleccionado, setSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://localhost:7224/api/lugares')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar lugares');
                return res.json();
            })
            .then(data => {
                setLugares(data);
                setCargando(false);
            })
            .catch(err => {
                setError(err.message);
                setCargando(false);
            });
    }, []);

    const handleBuscar = () => {
        if (seleccionado) {
            navigate(`/lugar/${seleccionado.id}`);
        } else {
            navigate(`/lugar?query=${encodeURIComponent(busqueda)}`);
        }
    };

    const lugaresAleatorios = (arr, n) => {
        const copia = [...arr];
        const seleccionados = [];
        while (seleccionados.length < n && copia.length > 0) {
            const idx = Math.floor(Math.random() * copia.length);
            seleccionados.push(copia.splice(idx, 1)[0]);
        }
        return seleccionados;
    };

    if (cargando) return <p>Cargando lugares...</p>;
    if (error) return <p>Error: {error}</p>;

    const destacados = lugaresAleatorios(lugares, 3);

    return (
        <Layout>
            {/* Carrusel al tope absoluto */}
            <Box sx={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', mt: '-64px' }}>
                <Carousel
                    controls={false}
                    indicators={false}
                    interval={10000}
                    fade
                    slide={true}
                    pause={false} // <-- fuerza que no se detenga
                >
                    {destacados.map((lugar, idx) => (
                        <Carousel.Item key={idx}>
                            <img
                                src={lugar.imagenUrl}
                                alt={lugar.nombre}
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'cover',
                                    filter: 'brightness(60%)',
                                }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>

                {/* Contenido sobre el carrusel */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        textAlign: 'center',
                        px: 2,
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
                        Turismo Comunitario
                    </Typography>

                    <Autocomplete
                        freeSolo
                        options={
                            busqueda.length > 0
                                ? lugares.filter((l) =>
                                    l.nombre.toLowerCase().includes(busqueda.toLowerCase())
                                ).slice(0, 5)
                                : []
                        }
                        getOptionLabel={(option) => option.nombre}
                        onInputChange={(e, value) => setBusqueda(value)}
                        onChange={(e, value) => {
                            setSeleccionado(value);
                            setBusqueda(value ? value.nombre : '');
                        }}
                        sx={{
                            width: '90%',
                            maxWidth: 600,
                            backgroundColor: 'white',
                            borderRadius: 2,
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Buscar destino..."
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleBuscar} edge="end" color="primary">
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>
            </Box>

            {/* Recomendaciones */}
            <Box sx={{ mt: 6, px: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Recomendaciones para ti
                </Typography>
                <Grid container spacing={3}>
                    {destacados.map((lugar) => (
                        <Grid item xs={12} sm={6} md={4} key={lugar.id}>
                            <Card
                                sx={{
                                    width: 320,
                                    height: 320,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: 3,
                                }}
                            >
                                <CardActionArea onClick={() => navigate(`/lugar/${lugar.id}`)}>
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        image={lugar.imagenUrl}
                                        alt={lugar.nombre}
                                    />
                                    <CardContent sx={{ minHeight: '400px' }}>
                                        <Typography variant="h6" gutterBottom>
                                            {lugar.nombre}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {lugar.descripcion.slice(0, 100)}...
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Layout>
    );
}

export default Home;
