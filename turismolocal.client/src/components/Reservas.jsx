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
                .then(res => res.ok ? res.json() : Promise.reject('Error al cargar reservas'))
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
        const ini = new Date(inicio);
        const fi = new Date(fin);
        return reservasExistentes.some(r => {
            const ri = new Date(r.tiempoInicio);
            const rf = new Date(r.tiempoFin);
            return (ini < rf && fi > ri);
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
        const nuevas = [...personas];
        nuevas[index][campo] = valor;
        if (campo === 'edad') {
            nuevas[index].clasificacionEdad = clasificarEdad(valor);
        }
        setPersonas(nuevas);
    };

    const handleMascotasChange = (e) => setLlevaMascotas(e.target.checked);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!usuario?.id) return alert('Debe iniciar sesión.');
        if (!lugarId || !fechaInicio || !fechaFin) return alert('Complete todos los campos.');

        const ini = new Date(fechaInicio);
        const fi = new Date(fechaFin);

        if (ini >= fi) return alert('La fecha inicio debe ser anterior a la fecha fin.');
        if ((fi - ini) < 60 * 60 * 1000) return alert('Duración mínima: 1 hora.');

        if (hayConflictoReserva(fechaInicio, fechaFin)) {
            return alert('Ya hay una reserva en ese horario.');
        }

        if (excesoPersonas) {
            return alert('Cantidad de personas excede máximo recomendado.');
        }

        for (const p of personas) {
            if (!p.clasificacionEdad) return alert('Ingrese edades válidas.');
        }

        const tiempoInicioISO = new Date(fechaInicio).toISOString();
        const tiempoFinISO = new Date(fechaFin).toISOString();

        const reserva = {
            usuarioId: usuario.id,
            lugarId: parseInt(lugarId),
            cantidadPersonas,
            discapacidad: personas.some(p => p.discapacidad),
            tiempoInicio: tiempoInicioISO,
            tiempoFin: tiempoFinISO,
            personasJson: JSON.stringify(personas)
        };

        fetch('https://localhost:7224/api/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${usuario?.token}`
            },
            body: JSON.stringify(reserva)
        })
            .then(res => {
                if (!res.ok) throw new Error('Error al guardar reserva');
                return res.json();
            })
            .then(data => {
                alert('Reserva guardada con éxito');
                navigate('/pagos', { state: data });
            })
            .catch(err => {
                alert(err.message);
            });
    };

    const lugar = lugares.find(l => l.id === parseInt(lugarId));
    const dias = fechaInicio && fechaFin ? calcularDiasEntre(fechaInicio, fechaFin) : 1;
    const total = lugar ? lugar.precio * cantidadPersonas * dias : 0;

    return (
        <Layout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Reservar Lugar</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {/* Lado Izquierdo */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, height: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="lugar-label">Lugar</InputLabel>
                                    <Select
                                        labelId="lugar-label"
                                        value={lugarId}
                                        label="Lugar"
                                        onChange={handleLugarChange}
                                        required
                                    >
                                        <MenuItem value="">-- Seleccione --</MenuItem>
                                        {lugares.map(l => (
                                            <MenuItem key={l.id} value={l.id}>
                                                {l.nombre} {l.personasRecomendadas ? `(${l.personasRecomendadas})` : ''}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {lugar && (
                                    <Card>
                                        {lugar.imagenUrl && (
                                            <img src={lugar.imagenUrl} alt={lugar.nombre} style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
                                        )}
                                        <CardContent>
                                            <Typography variant="h6">{lugar.nombre}</Typography>
                                            <Typography>{lugar.descripcion}</Typography>
                                            <Typography><strong>Precio/persona:</strong> ${lugar.precio}</Typography>
                                        </CardContent>
                                    </Card>
                                )}

                                <TextField
                                    label="Cantidad de Personas"
                                    type="number"
                                    inputProps={{ min: 1, max: 20 }}
                                    value={cantidadPersonas}
                                    onChange={handleCantidadPersonasChange}
                                    required
                                />
                                {excesoPersonas && (
                                    <Typography color="warning.main">⚠️ Cantidad excede máximo recomendado.</Typography>
                                )}

                                <FormControlLabel
                                    control={<Checkbox checked={llevaMascotas} onChange={handleMascotasChange} />}
                                    label="¿Llevará mascotas?"
                                />

                                <TextField
                                    label="Fecha inicio"
                                    type="datetime-local"
                                    value={fechaInicio}
                                    onChange={e => setFechaInicio(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                                <TextField
                                    label="Fecha fin"
                                    type="datetime-local"
                                    value={fechaFin}
                                    onChange={e => setFechaFin(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />

                                <Divider />
                                <Typography><strong>Total:</strong> ${total}</Typography>
                            </Box>
                        </Grid>

                        {/* Lado Derecho */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, height: '600px', overflowY: 'auto' }}>
                                <Typography variant="h6">Personas</Typography>
                                {personas.length === 0 && (
                                    <Typography color="text.secondary">Agregue cantidad de personas.</Typography>
                                )}
                                {personas.map((p, i) => (
                                    <Box key={i} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                        <Typography>Persona {i + 1} {p.clasificacionEdad && `- ${p.clasificacionEdad}`}</Typography>
                                        <TextField
                                            label="Nombre"
                                            fullWidth
                                            margin="dense"
                                            value={p.nombre}
                                            onChange={e => handlePersonaChange(i, 'nombre', e.target.value)}
                                            required
                                        />
                                        <TextField
                                            label="Apellido"
                                            fullWidth
                                            margin="dense"
                                            value={p.apellido}
                                            onChange={e => handlePersonaChange(i, 'apellido', e.target.value)}
                                            required
                                        />
                                        <TextField
                                            label="Edad"
                                            type="number"
                                            fullWidth
                                            margin="dense"
                                            value={p.edad}
                                            onChange={e => handlePersonaChange(i, 'edad', e.target.value)}
                                            required
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={p.discapacidad}
                                                    onChange={e => handlePersonaChange(i, 'discapacidad', e.target.checked)}
                                                />
                                            }
                                            label="¿Tiene discapacidad?"
                                        />
                                        {p.discapacidad && (
                                            <TextField
                                                label="Descripción discapacidad"
                                                fullWidth
                                                margin="dense"
                                                value={p.descripcionDiscapacidad}
                                                onChange={e => handlePersonaChange(i, 'descripcionDiscapacidad', e.target.value)}
                                            />
                                        )}
                                    </Box>
                                ))}

                                <Button variant="contained" type="submit" fullWidth>Confirmar Reserva</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Layout>
    );
}

export default Reservas;
