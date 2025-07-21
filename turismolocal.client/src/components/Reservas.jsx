import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField,
    Checkbox, FormControlLabel, Button, Card, CardContent, Divider
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

function Reservas() {
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();

    const [lugares, setLugares] = useState([]);
    const [lugarId, setLugarId] = useState('');
    const [cantidadPersonas, setCantidadPersonas] = useState(1);
    const [personas, setPersonas] = useState([]);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [excesoPersonas, setExcesoPersonas] = useState(false);
    const [reservasExistentes, setReservasExistentes] = useState([]);
    const [llevaMascotas, setLlevaMascotas] = useState(false);

    useEffect(() => {
        fetch('https://localhost:7224/api/lugares')
            .then(res => res.ok ? res.json() : Promise.reject('Error al cargar lugares'))
            .then(setLugares)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (lugarId) {
            fetch(`https://localhost:7224/api/reservas/lugar/${lugarId}`)
                .then(res => res.ok ? res.json() : Promise.reject('Error al cargar reservas existentes'))
                .then(setReservasExistentes)
                .catch(console.error);
        } else {
            setReservasExistentes([]);
        }
    }, [lugarId]);

    const obtenerMaximoPersonas = (id) => {
        const lugar = lugares.find(l => l.id === parseInt(id));
        if (lugar?.personasRecomendadas) {
            const partes = lugar.personasRecomendadas.split('-');
            return partes.length === 2 ? parseInt(partes[1]) : null;
        }
        return null;
    };

    const hayConflictoReserva = (inicio, fin) => {
        const nuevaInicio = new Date(inicio);
        const nuevaFin = new Date(fin);
        return reservasExistentes.some(reserva => {
            const reservaInicio = new Date(reserva.tiempoInicio);
            const reservaFin = new Date(reserva.tiempoFin);
            return (nuevaInicio < reservaFin && nuevaFin > reservaInicio);
        });
    };

    const calcularDiasEntre = (inicio, fin) => {
        const ini = new Date(inicio);
        const fi = new Date(fin);
        const diffTime = fi - ini;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const clasificarEdad = (edad) => {
        const e = Number(edad);
        if (isNaN(e) || e < 0) return '';
        if (e < 2) return 'Bebé';
        if (e <= 12) return 'Niño';
        if (e <= 59) return 'Adulto';
        return 'Adulto Mayor';
    };

    const handleLugarChange = (e) => {
        const nuevoId = e.target.value;
        setLugarId(nuevoId);
        const max = obtenerMaximoPersonas(nuevoId);
        setExcesoPersonas(max && cantidadPersonas > max);
    };

    const handleCantidadPersonasChange = (e) => {
        const cantidad = parseInt(e.target.value);
        setCantidadPersonas(cantidad);
        const max = obtenerMaximoPersonas(lugarId);
        setExcesoPersonas(max && cantidad > max);
        const nuevasPersonas = Array.from({ length: cantidad }, (_, i) => personas[i] || {
            nombre: '', apellido: '', edad: '', discapacidad: false, descripcionDiscapacidad: '', clasificacionEdad: ''
        });
        setPersonas(nuevasPersonas);
    };

    const handlePersonaChange = (index, campo, valor) => {
        const nuevasPersonas = [...personas];
        nuevasPersonas[index][campo] = valor;
        if (campo === 'edad') {
            nuevasPersonas[index].clasificacionEdad = clasificarEdad(valor);
        }
        setPersonas(nuevasPersonas);
    };

    const handleMascotasChange = (e) => {
        setLlevaMascotas(e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!usuario?.id) return alert('Debe iniciar sesión para hacer una reserva.');
        if (!lugarId || !fechaInicio || !fechaFin) return alert('Complete todos los campos.');

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (inicio >= fin) return alert('La fecha de inicio debe ser anterior a la fecha de fin.');
        if ((fin - inicio) < 60 * 60 * 1000) return alert('La duración mínima es de una hora.');
        if (hayConflictoReserva(fechaInicio, fechaFin)) return alert('Ya existe una reserva en ese horario.');
        if (excesoPersonas) return alert('Cantidad de personas excede el máximo recomendado.');

        for (const p of personas) {
            if (!p.clasificacionEdad) return alert('Ingrese edades válidas para todas las personas.');
        }

        const lugarSeleccionado = lugares.find(l => l.id === parseInt(lugarId));
        const dias = calcularDiasEntre(fechaInicio, fechaFin);
        const total = lugarSeleccionado ? lugarSeleccionado.precio * cantidadPersonas * dias : 0;

        const reserva = {
            usuarioId: usuario.id,
            lugarId: parseInt(lugarId),
            cantidadPersonas,
            discapacidad: personas.some(p => p.discapacidad),
            tiempoInicio: fechaInicio,
            tiempoFin: fechaFin,
            personas,
            llevaMascotas,
            valorTotal: total
        };

        navigate('/pagos', { state: reserva });
    };

    const lugarSeleccionado = lugares.find(l => l.id === parseInt(lugarId));
    const dias = fechaInicio && fechaFin ? calcularDiasEntre(fechaInicio, fechaFin) : 1;
    const total = lugarSeleccionado ? lugarSeleccionado.precio * cantidadPersonas * dias : 0;

    return (
        <Layout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Reservar Lugar</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {/* Panel izquierdo: formulario de reserva */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="lugar-select-label">Lugar</InputLabel>
                                    <Select
                                        labelId="lugar-select-label"
                                        value={lugarId}
                                        label="Lugar"
                                        onChange={handleLugarChange}
                                        required
                                    >
                                        <MenuItem value="">-- Seleccione --</MenuItem>
                                        {lugares.map(lugar => (
                                            <MenuItem key={lugar.id} value={lugar.id}>
                                                {lugar.nombre} {lugar.personasRecomendadas ? `(${lugar.personasRecomendadas})` : ''}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Cantidad de Personas"
                                    type="number"
                                    inputProps={{ min: 1, max: 20 }}
                                    value={cantidadPersonas}
                                    onChange={handleCantidadPersonasChange}
                                    required
                                />
                                {excesoPersonas && (
                                    <Typography color="warning.main">
                                        ⚠️ La cantidad de personas excede el máximo recomendado.
                                    </Typography>
                                )}

                                <FormControlLabel
                                    control={<Checkbox checked={llevaMascotas} onChange={handleMascotasChange} />}
                                    label="¿Llevará mascotas?"
                                />

                                <TextField
                                    label="Fecha y hora inicio"
                                    type="datetime-local"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                                <TextField
                                    label="Fecha y hora fin"
                                    type="datetime-local"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Continuar a pago
                                </Button>
                            </Box>
                        </Grid>

                        {/* Panel derecho: imagen + resumen */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                {lugarSeleccionado?.imagenUrl && (
                                    <img
                                        src={lugarSeleccionado.imagenUrl}
                                        alt={lugarSeleccionado.nombre}
                                        style={{ width: '100%', maxHeight: 240, objectFit: 'cover' }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6">{lugarSeleccionado?.nombre || 'Lugar no seleccionado'}</Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>{lugarSeleccionado?.descripcion}</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="subtitle1"><strong>Resumen de reserva:</strong></Typography>
                                    <Typography><strong>Lugar:</strong> {lugarSeleccionado?.nombre || '-'}</Typography>
                                    <Typography><strong>Cantidad Personas:</strong> {cantidadPersonas}</Typography>
                                    <Typography><strong>Fechas:</strong> {fechaInicio ? new Date(fechaInicio).toLocaleString() : '-'} - {fechaFin ? new Date(fechaFin).toLocaleString() : '-'}</Typography>
                                    <Typography><strong>Lleva mascotas:</strong> {llevaMascotas ? 'Sí' : 'No'}</Typography>
                                    <Typography><strong>Total a pagar:</strong> ${total}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Formulario de personas debajo */}
                        <Grid item xs={12}>
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom>Información de las Personas</Typography>
                                <Grid container spacing={2}>
                                    {personas.map((p, i) => (
                                        <Grid item xs={12} md={6} key={i}>
                                            <Card variant="outlined" sx={{ p: 2 }}>
                                                <Typography variant="subtitle1">Persona {i + 1}</Typography>
                                                <TextField
                                                    label="Nombre"
                                                    fullWidth
                                                    margin="dense"
                                                    value={p.nombre}
                                                    onChange={(e) => handlePersonaChange(i, 'nombre', e.target.value)}
                                                    required
                                                />
                                                <TextField
                                                    label="Apellido"
                                                    fullWidth
                                                    margin="dense"
                                                    value={p.apellido}
                                                    onChange={(e) => handlePersonaChange(i, 'apellido', e.target.value)}
                                                    required
                                                />
                                                <TextField
                                                    label="Edad"
                                                    type="number"
                                                    fullWidth
                                                    margin="dense"
                                                    value={p.edad}
                                                    onChange={(e) => handlePersonaChange(i, 'edad', e.target.value)}
                                                    required
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={p.discapacidad}
                                                            onChange={(e) => handlePersonaChange(i, 'discapacidad', e.target.checked)}
                                                        />
                                                    }
                                                    label="Discapacidad"
                                                />
                                                {p.discapacidad && (
                                                    <TextField
                                                        label="Descripción discapacidad"
                                                        fullWidth
                                                        margin="dense"
                                                        value={p.descripcionDiscapacidad}
                                                        onChange={(e) => handlePersonaChange(i, 'descripcionDiscapacidad', e.target.value)}
                                                    />
                                                )}
                                                <Typography variant="body2" color="textSecondary">
                                                    Clasificación: {p.clasificacionEdad || 'No definida'}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Layout>
    );
}

export default Reservas;
