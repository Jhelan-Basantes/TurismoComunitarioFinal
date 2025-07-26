/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 *
 * Descripción general:
 * Este componente representa la página de inicio del sistema "TurismoLocal".
 * Ofrece una experiencia interactiva con un banner dinámico, buscador inteligente,
 * botones de categorías, recomendaciones personalizadas y una llamada a la acción.
 * Utiliza tecnologías como React, Material UI, Framer Motion para animaciones
 * y React Router para navegación dinámica entre vistas.
 *
 * Funcionalidades principales:
 * - Carga y muestra una lista de lugares turísticos desde la API.
 * - Muestra un banner con mensajes rotativos y una imagen destacada que cambia al hacer click.
 * - Proporciona un buscador con autocompletado para filtrar destinos por nombre.
 * - Presenta botones dinámicos de categorías basados en los datos disponibles.
 * - Muestra recomendaciones personalizadas seleccionadas aleatoriamente.
 * - Permite navegación a detalles específicos del lugar o al catálogo filtrado.
 * - Incluye un llamado a la acción para redirigir al catálogo de destinos.
 *
 * Aspectos técnicos:
 * - Uso de useEffect para cargar datos al inicio y manejar estados de carga y error.
 * - Manejo de estados con useState para búsquedas, mensajes, imágenes y categorías.
 * - Uso de useRef para mantener recomendaciones estables sin re-renderizados innecesarios.
 * - Animaciones suaves con Framer Motion para mensajes en el banner.
 * - Responsive design mediante Material UI y estilos adaptativos.
 */


import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import {
    TextField, InputAdornment, IconButton, Box, Typography, Autocomplete, Grid,
    Button, CircularProgress, Card, CardContent, CardMedia, Container, Divider, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';

// Mensajes rotativos que se muestran en el banner principal
const mensajes = [
    'Bienvenido',
    'Elige tu aventura',
    'Explora con nosotros',
    'Descubre nuevos destinos',
    'Viaja, sueña, vive'
];

function Home() {
    // Estado para los lugares cargados desde la API
    const [lugares, setLugares] = useState([]);

    // Estados relacionados con la búsqueda de destinos
    const [busqueda, setBusqueda] = useState('');
    const [seleccionado, setSeleccionado] = useState(null);

    // Estados para manejo de carga y errores
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Estado para cambiar el mensaje del banner dinámicamente
    const [mensajeIndex, setMensajeIndex] = useState(Math.floor(Math.random() * mensajes.length));

    // Categorías únicas extraídas de los lugares
    const [categorias, setCategorias] = useState([]);

    // Imagen actual que se muestra en el banner
    const [imagenCarrusel, setImagenCarrusel] = useState(null);

    // Referencia para mantener las recomendaciones fijas aunque el componente se re-renderice
    const recomendacionesRef = useRef([]);

    const navigate = useNavigate();
    const theme = useTheme();

    // Efecto para cargar los lugares al montar el componente
    useEffect(() => {
        fetch('https://localhost:7224/api/lugares')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar lugares');
                return res.json();
            })
            .then(data => {
                setLugares(data);
                recomendacionesRef.current = seleccionarAleatorios(data, 4);
                const cats = [...new Set(data.map(l => l.categoria))].filter(Boolean);
                setCategorias(cats);
                const imagenInicial = data.length > 0 ? seleccionarAleatorios(data, 1)[0].imagenUrl : null;
                setImagenCarrusel(imagenInicial);
                setCargando(false);
            })
            .catch(err => {
                setError(err.message);
                setCargando(false);
            });
    }, []);

    /**
     * Función utilitaria que selecciona elementos aleatorios de un arreglo.
     * @param {Array} arr - arreglo de entrada
     * @param {number} n - cantidad de elementos a seleccionar
     */
    const seleccionarAleatorios = (arr, n) => {
        const copia = [...arr];
        const seleccionados = [];
        while (seleccionados.length < n && copia.length > 0) {
            const idx = Math.floor(Math.random() * copia.length);
            seleccionados.push(copia.splice(idx, 1)[0]);
        }
        return seleccionados;
    };

    /**
     * Ejecuta una búsqueda basada en la entrada del usuario.
     * Redirige a la página del destino si existe.
     */
    const handleBuscar = () => {
        if (seleccionado) {
            navigate(`/lugar/${seleccionado.id}`);
        } else if (busqueda.trim() !== '') {
            const resultado = lugares.find(l =>
                l.nombre.toLowerCase() === busqueda.toLowerCase()
            );
            navigate(resultado ? `/lugar/${resultado.id}` : '/catalogo');
        }
    };

    /**
     * Redirige al catálogo filtrado por la categoría seleccionada.
     * @param {string} categoria
     */
    const handleCategoriaClick = (categoria) => {
        navigate(`/catalogo?categoria=${encodeURIComponent(categoria)}`);
    };

    /**
     * Ejecuta la búsqueda al presionar Enter.
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleBuscar();
    };

    /**
     * Actualiza el mensaje e imagen del banner aleatoriamente.
     */
    const handleActualizarMensaje = () => {
        setMensajeIndex(Math.floor(Math.random() * mensajes.length));
        const nueva = seleccionarAleatorios(lugares, 1)[0];
        setImagenCarrusel(nueva?.imagenUrl || null);
    };

    const recomendaciones = recomendacionesRef.current;

    // Render de carga mientras se obtienen los datos
    if (cargando) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Render en caso de error
    if (error) return <p>Error: {error}</p>;

    return (
        <Layout>
            {/* Banner principal con imagen, mensaje y buscador */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: '300px', md: '600px' },
                    overflow: 'hidden',
                    mt: '-64px'
                }}
            >
                <img
                    src={imagenCarrusel || '/img/banner.jpg'}
                    alt="Banner"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(50%)'
                    }}
                    onClick={handleActualizarMensaje}
                />
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
                        zIndex: 1
                    }}
                >
                    {/* Animación del mensaje del banner */}
                    <motion.div
                        key={mensajeIndex}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                            {mensajes[mensajeIndex]}
                        </Typography>
                    </motion.div>

                    {/* Buscador con autocompletado */}
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
                                onKeyDown={handleKeyPress}
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

                    {/* Botones de categorías dinámicas */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {categorias.map((cat, idx) => (
                            <Button
                                key={idx}
                                variant="contained"
                                color="secondary"
                                onClick={() => handleCategoriaClick(cat)}
                                sx={{
                                    backgroundColor: '#ffffffcc',
                                    color: 'black',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#ffffffee',
                                    }
                                }}
                            >
                                {cat}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* Sección de recomendaciones personalizadas */}
            <Divider sx={{ mt: 6, mb: 3 }} />
            <Container maxWidth={false} sx={{ px: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
                        Recomendaciones para ti
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {recomendaciones.map((lugar) => (
                            <Grid item key={lugar.id}>
                                <Card
                                    sx={{
                                        width: 300,
                                        height: 350,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: 3,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/lugar/${lugar.id}`)}
                                >
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
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2">${lugar.precio}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="body2">
                                                    {lugar.calificacion?.toFixed(1) ?? '0.0'}
                                                </Typography>
                                                <StarIcon fontSize="small" color="warning" />
                                            </Box>
                                        </Box>

                                        {/* Botón "Ver más" */}
                                        <Box sx={{ mt: 'auto' }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<VisibilityIcon />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/lugar/${lugar.id}`);
                                                }}
                                            >
                                                Ver más
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* Llamado a la acción final */}
            <Box
                sx={{
                    mt: 6,
                    px: 2,
                    py: 5,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    ¿Listo para tu próxima aventura?
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Explora destinos únicos gestionados por comunidades locales.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: 'white',
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                        }
                    }}
                    onClick={() => navigate('/catalogo')}
                >
                    Ir al Catálogo
                </Button>
            </Box>
        </Layout>
    );
}

// Exportación principal del componente
export default Home;
