/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente permite a los usuarios con permisos agregar o editar lugares turísticos.
 * A través de un formulario interactivo y validado, los administradores o guías pueden 
 * registrar nuevos lugares o modificar la información existente (nombre, descripción, precio, 
 * ubicación, categoría, guía asociado e imagen).
 * 
 * Funcionalidades principales:
 * - Carga y muestra la lista de lugares existentes desde la API.
 * - Permite seleccionar un lugar para editar sus datos o limpiar el formulario para agregar uno nuevo.
 * - Valida y envía datos al backend para crear o actualizar lugares.
 * - Muestra una previsualización de la imagen basada en la URL ingresada.
 * - Utiliza animaciones suaves con Framer Motion para mejorar la experiencia del usuario.
 * 
 * Componentes utilizados:
 * - Material UI para la interfaz visual (formulario, botones, tarjetas, etc.).
 * - Layout para estructura común del sitio.
 */


import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Card,
    CardContent,
    CardMedia,
    Grid,
} from '@mui/material';
import { Save, AddLocationAlt, EditLocationAlt } from '@mui/icons-material';
import { motion } from 'framer-motion';

void motion;
function AgregarLugar() {
    // Estado para lista de lugares obtenidos desde la API
    const [lugares, setLugares] = useState([]);

    // Estado que controla si estamos en modo edición
    const [modoEdicion, setModoEdicion] = useState(false);

    // Lugar seleccionado para edición
    const [lugarSeleccionado, setLugarSeleccionado] = useState(null);

    // Campos del formulario
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [idGuia, setIdGuia] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");

    // Cargar lista de lugares al cargar el componente
    useEffect(() => {
        fetch("https://localhost:7224/api/lugares")
            .then(res => res.json())
            .then(data => setLugares(data))
            .catch(err => console.error(err));
    }, []);

    /**
     * Maneja la selección de un lugar para edición desde el menú desplegable.
     * Carga los datos en el formulario si se selecciona un lugar existente.
     */
    const manejarSeleccion = (id) => {
        const lugar = lugares.find(l => l.id === parseInt(id));
        if (lugar) {
            setModoEdicion(true);
            setLugarSeleccionado(lugar);
            setNombre(lugar.nombre);
            setDescripcion(lugar.descripcion);
            setPrecio(lugar.precio);
            setUbicacion(lugar.ubicacion);
            setCategoria(lugar.categoria || "");
            setIdGuia(lugar.idGuia);
            setImagenUrl(lugar.imagenUrl || "");
        } else {
            limpiarFormulario();
            setModoEdicion(false);
            setLugarSeleccionado(null);
        }
    };

    /**
     * Limpia los campos del formulario.
     */
    const limpiarFormulario = () => {
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setUbicacion("");
        setCategoria("");
        setIdGuia("");
        setImagenUrl("");
    };

    /**
     * Envía los datos del formulario para agregar o actualizar un lugar.
     * Realiza validaciones básicas y utiliza la API para persistir los datos.
     */
    const manejarSubmit = async (e) => {
        e.preventDefault();

        const lugarData = {
            nombre,
            descripcion,
            precio: parseFloat(precio),
            ubicacion,
            categoria,
            idGuia: parseInt(idGuia),
            imagenUrl,
        };

        const url = modoEdicion
            ? `https://localhost:7224/api/lugares/${lugarSeleccionado.id}`
            : "https://localhost:7224/api/lugares";

        const method = modoEdicion ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(modoEdicion ? { ...lugarData, id: lugarSeleccionado.id } : lugarData),
        });

        if (res.ok) {
            alert(modoEdicion ? "Lugar actualizado con éxito" : "Lugar agregado con éxito");
        } else {
            alert("Error al guardar lugar");
        }

        limpiarFormulario();
        setModoEdicion(false);
        setLugarSeleccionado(null);
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box maxWidth={900} mx="auto" my={5} p={3}>
                    {/* Título dinámico */}
                    <Typography variant="h4" gutterBottom align="center">
                        {modoEdicion ? <EditLocationAlt fontSize="large" /> : <AddLocationAlt fontSize="large" />}
                        {modoEdicion ? " Editar Lugar" : " Agregar Lugar"}
                    </Typography>

                    {/* Selector de lugar para edición */}
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel>Seleccionar Lugar</InputLabel>
                        <Select
                            value={lugarSeleccionado?.id || ""}
                            onChange={(e) => manejarSeleccion(e.target.value)}
                            label="Seleccionar Lugar"
                        >
                            <MenuItem value="">-- Nuevo Lugar --</MenuItem>
                            {lugares.map((lugar) => (
                                <MenuItem key={lugar.id} value={lugar.id}>
                                    {lugar.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Formulario de lugar */}
                    <form onSubmit={manejarSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} required />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    multiline
                                    minRows={4}
                                    value={descripcion}
                                    onChange={e => setDescripcion(e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Precio por Persona"
                                    type="number"
                                    value={precio}
                                    onChange={e => setPrecio(e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Categoría"
                                    value={categoria}
                                    onChange={e => setCategoria(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="ID del Guía"
                                    type="number"
                                    value={idGuia}
                                    onChange={e => setIdGuia(e.target.value)}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="URL de la Imagen"
                                    value={imagenUrl}
                                    onChange={e => setImagenUrl(e.target.value)}
                                />
                            </Grid>

                            {/* Previsualización de imagen */}
                            {imagenUrl && (
                                <Grid item xs={12}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={imagenUrl}
                                            alt="Previsualización"
                                        />
                                        <CardContent>
                                            <Typography variant="caption" align="center" display="block">
                                                Previsualización de la imagen
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {/* Botón de envío */}
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save />}
                                >
                                    {modoEdicion ? "Actualizar Lugar" : "Agregar Lugar"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </motion.div>
        </Layout>
    );
}

// Exportación del componente
export default AgregarLugar;
