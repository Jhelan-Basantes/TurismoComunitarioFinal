/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente permite a los guías agregar o editar lugares turísticos en la plataforma.
 * Integra un formulario dinámico que se rellena automáticamente al seleccionar un lugar ya existente,
 * permitiendo su edición, o bien permite crear un nuevo lugar desde cero.
 * Usa la API REST para enviar solicitudes POST (crear) o PUT (actualizar) según el contexto.
 * Se apoya en Material UI para el diseño visual y en Framer Motion para animación de entrada.
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
void motion; // Evita advertencia por importación sin uso directo

/**
 * Componente AgregarEditarLugar
 * 
 * Proporciona un formulario controlado para crear o modificar lugares turísticos.
 * Se comunica con la API `api/lugares` y soporta selección de lugares existentes.
 */
function AgregarEditarLugar() {
    const [lugares, setLugares] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [lugarSeleccionado, setLugarSeleccionado] = useState(null);

    // Campos del formulario
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [idGuia, setIdGuia] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");

    // Carga inicial de lugares desde la API
    useEffect(() => {
        fetch("https://localhost:7224/api/lugares")
            .then(res => res.json())
            .then(data => setLugares(data))
            .catch(err => console.error(err));
    }, []);

    /**
     * Maneja la selección de un lugar desde el menú desplegable.
     * Si existe, carga sus datos para edición. Si no, limpia el formulario.
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

    // Limpia los campos del formulario
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
     * Maneja el envío del formulario, realizando una petición POST o PUT según el modo.
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
            {/* Animación de entrada con Framer Motion */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box maxWidth={700} mx="auto" my={5} p={3}>
                    <Typography variant="h4" gutterBottom align="center">
                        {modoEdicion ? <EditLocationAlt fontSize="large" /> : <AddLocationAlt fontSize="large" />}
                        {modoEdicion ? "Editar Lugar" : "Agregar Lugar"}
                    </Typography>

                    {/* Selector de lugar existente para editar */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
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

                    {/* Formulario de ingreso y edición */}
                    <form onSubmit={manejarSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    multiline
                                    rows={4}
                                    value={descripcion}
                                    onChange={e => setDescripcion(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Precio por Persona"
                                    type="number"
                                    value={precio}
                                    onChange={e => setPrecio(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Ubicación"
                                    value={ubicacion}
                                    onChange={e => setUbicacion(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Categoría"
                                    value={categoria}
                                    onChange={e => setCategoria(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="ID del Guía"
                                    type="number"
                                    value={idGuia}
                                    onChange={e => setIdGuia(e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="URL de la imagen"
                                    value={imagenUrl}
                                    onChange={e => setImagenUrl(e.target.value)}
                                />
                            </Grid>

                            {/* Previsualización de imagen, si se proporciona una URL */}
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
                                            <Typography variant="caption" align="center">Previsualización de la imagen</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {/* Botón para guardar o actualizar */}
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

export default AgregarEditarLugar;
