/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  Fecha: 25/7/2025
 * 
 * Descripción General:
 * 
 * Componente `Reservas.jsx` que permite a los usuarios realizar reservas para lugares turísticos.
 * 
 * Funcionalidades principales:
 * - Carga y muestra la lista de lugares turísticos disponibles desde la API.
 * - Permite seleccionar un lugar, fecha y hora de inicio y fin para la reserva.
 * - Define y valida la cantidad de personas que asistirán, con controles para incrementar o decrementar.
 * - Permite ingresar detalles de cada persona (nombre, apellido, edad, discapacidad, descripción de discapacidad).
 * - Clasifica automáticamente la edad de cada persona en categorías (bebé, niño, adulto, adulto mayor).
 * - Valida que las fechas sean válidas, no existan conflictos con reservas previas para el mismo lugar y que no se exceda el máximo recomendado de personas.
 * - Permite indicar si se llevarán mascotas.
 * - Calcula el total a pagar según el precio del lugar, cantidad de personas y duración de la reserva.
 * - Al enviar el formulario, valida los datos y navega a la página de pagos pasando el objeto reserva.
 * 
 * Tecnologías y librerías usadas:
 * - React con hooks (`useState`, `useEffect`, `useContext`).
 * - React Router (`useNavigate`) para navegación programática.
 * - Material UI para componentes de interfaz.
 * - `@mui/x-date-pickers` con `dayjs` para selección y manejo de fechas y horas.
 * - Contexto de autenticación para obtener información del usuario actual.
 * 
 * Este componente ofrece una interfaz intuitiva para la gestión completa de la reserva, incluyendo controles detallados
 * para las personas que asistirán y validaciones que aseguran la integridad y factibilidad de la reserva.
 */



import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField,
    Checkbox, FormControlLabel, Button, Card, CardContent, Divider,
    IconButton, Tooltip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import dayjs from 'dayjs';

function Reservas() {
    const { usuario } = useContext(AuthContext);
    const navigate = useNavigate();

    const [lugares, setLugares] = useState([]);
    const [lugarId, setLugarId] = useState('');
    const [cantidadPersonas, setCantidadPersonas] = useState(0);
    const [personas, setPersonas] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
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
        return reservasExistentes.some(reserva => {
            const reservaInicio = new Date(reserva.tiempoInicio);
            const reservaFin = new Date(reserva.tiempoFin);
            return (inicio < reservaFin && fin > reservaInicio);
        });
    };

    const calcularDiasEntre = (inicio, fin) => {
        const diffTime = fin - inicio;
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

    const actualizarPersonas = (cantidad) => {
        const nuevasPersonas = Array.from({ length: cantidad }, (_, i) => personas[i] || {
            nombre: '', apellido: '', edad: '', discapacidad: false, descripcionDiscapacidad: '', clasificacionEdad: ''
        });
        setPersonas(nuevasPersonas);
    };

    const incrementarCantidad = () => {
        const nuevaCantidad = cantidadPersonas + 1;
        setCantidadPersonas(nuevaCantidad);
        actualizarPersonas(nuevaCantidad);
        const max = obtenerMaximoPersonas(lugarId);
        setExcesoPersonas(max && nuevaCantidad > max);
    };

    const decrementarCantidad = () => {
        if (cantidadPersonas > 0) {
            const nuevaCantidad = cantidadPersonas - 1;
            setCantidadPersonas(nuevaCantidad);
            actualizarPersonas(nuevaCantidad);
            const max = obtenerMaximoPersonas(lugarId);
            setExcesoPersonas(max && nuevaCantidad > max);
        }
    };

    const handlePersonaChange = (index, campo, valor) => {
        const nuevasPersonas = [...personas];
        nuevasPersonas[index][campo] = valor;
        if (campo === 'edad') {
            nuevasPersonas[index].clasificacionEdad = clasificarEdad(valor);
        }
        setPersonas(nuevasPersonas);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!usuario?.id) return alert('Debe iniciar sesión.');
        if (!lugarId || !fechaInicio || !fechaFin) return alert('Complete todos los campos.');

        const inicio = fechaInicio.toDate();
        const fin = fechaFin.toDate();

        if (inicio >= fin) return alert('La fecha de inicio debe ser anterior.');
        if ((fin - inicio) < 60 * 60 * 1000) return alert('Duración mínima: 1 hora.');
        if (hayConflictoReserva(inicio, fin)) return alert('Ya existe una reserva en ese horario.');
        if (excesoPersonas) return alert('Excede el máximo recomendado.');
        for (const p of personas) {
            if (!p.clasificacionEdad) return alert('Edad inválida en al menos una persona.');
        }

        const lugar = lugares.find(l => l.id === parseInt(lugarId));
        const dias = calcularDiasEntre(inicio, fin);
        const total = lugar ? lugar.precio * cantidadPersonas * dias : 0;

        const reserva = {
            usuarioId: usuario.id,
            lugarId: parseInt(lugarId),
            cantidadPersonas,
            discapacidad: personas.some(p => p.discapacidad),
            tiempoInicio: inicio,
            tiempoFin: fin,
            personas,
            llevaMascotas,
            valorTotal: total
        };

        navigate('/pagos', { state: reserva });
    };

    const lugarSeleccionado = lugares.find(l => l.id === parseInt(lugarId));
    const dias = fechaInicio && fechaFin ? calcularDiasEntre(fechaInicio.toDate(), fechaFin.toDate()) : 1;
    const total = lugarSeleccionado ? lugarSeleccionado.precio * cantidadPersonas * dias : 0;

    return (
        <Layout>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                    {/* Formulario Izquierda */}
                    <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', p: 3, gap: 2 }}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                            <Typography variant="h5" gutterBottom>Reservar Lugar</Typography>
                            <FormControl fullWidth margin="normal">
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
                                            {l.nombre} {l.personasRecomendadas }
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box display="flex" alignItems="center" gap={2} sx={{ my: 2 }}>
                                <Typography>Personas:</Typography>
                                <IconButton onClick={decrementarCantidad}><RemoveIcon /></IconButton>
                                <Typography sx={{ width: 20, textAlign: 'center' }}>{cantidadPersonas}</Typography>
                                <IconButton onClick={incrementarCantidad}><AddIcon /></IconButton>
                            </Box>

                            {excesoPersonas && (
                                <Typography color="warning.main">
                                    ⚠️ Cantidad excede el máximo recomendado.
                                </Typography>
                            )}

                            <FormControlLabel
                                control={<Checkbox checked={llevaMascotas} onChange={e => setLlevaMascotas(e.target.checked)} />}
                                label="¿Llevará mascotas?"
                            />

                            <DateTimePicker
                                label="Fecha y hora de inicio"
                                value={fechaInicio}
                                onChange={(val) => setFechaInicio(val)}
                                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                            />
                            <DateTimePicker
                                label="Fecha y hora de fin"
                                value={fechaFin}
                                onChange={(val) => setFechaFin(val)}
                                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                            />

                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                                Continuar a pago
                            </Button>
                        </Box>

                        {/* Tarjeta resumen */}
                        <Card sx={{ display: 'flex', alignItems: 'stretch' }}>
                            {lugarSeleccionado?.imagenUrl && (
                                <Box
                                    component="img"
                                    src={lugarSeleccionado.imagenUrl}
                                    alt={lugarSeleccionado.nombre}
                                    sx={{ width: 150, height: '100%', objectFit: 'cover', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
                                />
                            )}
                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6">{lugarSeleccionado?.nombre || 'Lugar no seleccionado'}</Typography>
                                <Typography variant="body2" gutterBottom>{lugarSeleccionado?.descripcion}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography><strong>Personas:</strong> {cantidadPersonas}</Typography>
                                <Typography><strong>Inicio:</strong> {fechaInicio ? fechaInicio.format('DD/MM/YYYY HH:mm') : '-'}</Typography>
                                <Typography><strong>Fin:</strong> {fechaFin ? fechaFin.format('DD/MM/YYYY HH:mm') : '-'}</Typography>
                                <Typography><strong>Mascotas:</strong> {llevaMascotas ? 'Sí' : 'No'}</Typography>
                                <Typography sx={{ mt: 1 }}><strong>Total:</strong> ${total}</Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Contenedor Derecho - Personas */}
                    <Box sx={{
                        flex: 1,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Typography variant="h5">Información de las Personas</Typography>
                        {personas.map((p, i) => (
                            <Card key={i} variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1">Persona {i + 1}</Typography>
                                <Box display="flex" flexWrap="wrap" gap={2}>
                                    <TextField
                                        label="Nombre"
                                        value={p.nombre}
                                        onChange={(e) => handlePersonaChange(i, 'nombre', e.target.value)}
                                        size="small"
                                    />
                                    <TextField
                                        label="Apellido"
                                        value={p.apellido}
                                        onChange={(e) => handlePersonaChange(i, 'apellido', e.target.value)}
                                        size="small"
                                    />
                                    <TextField
                                        label="Edad"
                                        type="number"
                                        value={p.edad}
                                        onChange={(e) => handlePersonaChange(i, 'edad', e.target.value)}
                                        size="small"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={p.discapacidad}
                                                onChange={(e) => handlePersonaChange(i, 'discapacidad', e.target.checked)}
                                                size="small"
                                            />
                                        }
                                        label="Discapacidad"
                                    />
                                    {p.discapacidad && (
                                        <TextField
                                            label="Descripción"
                                            value={p.descripcionDiscapacidad}
                                            onChange={(e) => handlePersonaChange(i, 'descripcionDiscapacidad', e.target.value)}
                                            size="small"
                                            fullWidth
                                        />
                                    )}
                                </Box>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    Clasificación: {p.clasificacionEdad || 'No definida'}
                                </Typography>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </LocalizationProvider>
        </Layout>
    );
}

export default Reservas;
