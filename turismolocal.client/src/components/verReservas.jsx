/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño  
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025  
 * 
 * Descripción general:
 * Componente que muestra la lista de reservas realizadas por los usuarios autenticados.
 * Para cada reserva, se presenta información básica como lugar, cantidad de personas, fechas
 * y permite expandir para ver detalles específicos de cada persona incluida en la reserva.
 * 
 * Funcionalidades destacadas:
 * - Obtiene reservas y lugares relacionados desde la API con autorización Bearer Token.
 * - Permite eliminar reservas con confirmación previa y actualiza la vista en tiempo real.
 * - Utiliza animaciones de entrada/salida y expansión para mejorar la experiencia UX.
 * - Muestra notificaciones tipo Snackbar para informar al usuario sobre acciones exitosas o errores.
 * - Incluye manejo de estados de carga y errores de forma clara.
 * 
 * UI:
 * - Cada reserva aparece en una tarjeta con imagen del lugar, detalles resumidos y controles para eliminar y expandir.
 * - La tabla expandible despliega personas vinculadas a la reserva, mostrando datos relevantes (nombre, discapacidad, etc.).
 */


import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import { AuthContext } from '../context/AuthContext';

import {
    Card, CardContent, Typography, Grid, Collapse,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Slide, Avatar, Snackbar, Alert
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

// Botón de expansión animada para mostrar detalles de personas en la reserva
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function VerReservas() {
    const { usuario } = useContext(AuthContext);

    const [reservas, setReservas] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [expandidaId, setExpandidaId] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const cargarDatos = () => {
        setCargando(true);
        Promise.all([
            fetch('https://localhost:7224/api/reservas', {
                headers: {
                    Authorization: `Bearer ${usuario?.token}`
                }
            }).then(res => {
                if (!res.ok) throw new Error('Error al cargar reservas');
                return res.json();
            }),
            fetch('https://localhost:7224/api/lugares').then(res => {
                if (!res.ok) throw new Error('Error al cargar lugares');
                return res.json();
            }),
        ])
            .then(([resData, lugaresData]) => {
                setReservas(resData);
                setLugares(lugaresData);
                setCargando(false);
            })
            .catch(err => {
                setError(err.message);
                setCargando(false);
            });
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const eliminarReserva = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta reserva?')) return;
        setEliminandoId(id);
        try {
            const response = await fetch(`https://localhost:7224/api/reservas/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${usuario?.token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw new Error(await response.text());
            setReservas(prev => prev.filter(r => r.id !== id));
            setSnackbar({ open: true, message: 'Reserva eliminada con éxito', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
        } finally {
            setEliminandoId(null);
        }
    };

    const toggleExpand = (id) => {
        setExpandidaId(prev => (prev === id ? null : id));
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (cargando) return <Typography>Cargando reservas...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>Lista de Reservas</Typography>

            <Grid container direction="column" spacing={2}>
                {reservas.map((r) => {
                    const lugar = lugares.find(l => l.id === r.lugarId);
                    const nombreLugar = lugar ? lugar.nombre : 'Lugar no encontrado';
                    const imagenURL = lugar?.imagenUrl || '/placeholder.jpg';
                    const personas = r.personasJson ? JSON.parse(r.personasJson) : [];

                    return (
                        <Slide key={r.id} direction="left" in={eliminandoId !== r.id} mountOnEnter unmountOnExit>
                            <Grid item>
                                <Card sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                                    <Avatar
                                        variant="rounded"
                                        sx={{ width: 100, height: 100, marginRight: 2 }}
                                        src={imagenURL}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6">Reserva #{r.id} - {nombreLugar}</Typography>
                                        <Typography variant="body2">Personas: {r.cantidadPersonas}</Typography>
                                        <Typography variant="body2">Inicio: {new Date(r.tiempoInicio).toLocaleString()}</Typography>
                                        <Typography variant="body2">Fin: {new Date(r.tiempoFin).toLocaleString()}</Typography>
                                    </CardContent>

                                    <IconButton onClick={() => eliminarReserva(r.id)} disabled={eliminandoId === r.id}>
                                        <DeleteIcon color="error" />
                                    </IconButton>

                                    <ExpandMore
                                        expand={expandidaId === r.id}
                                        onClick={() => toggleExpand(r.id)}
                                        aria-expanded={expandidaId === r.id}
                                        aria-label="mostrar más"
                                    >
                                        <ExpandMoreIcon />
                                    </ExpandMore>
                                </Card>

                                <Collapse in={expandidaId === r.id} timeout="auto" unmountOnExit>
                                    <TableContainer sx={{ mt: 1 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Nombre</TableCell>
                                                    <TableCell>Apellido</TableCell>
                                                    <TableCell>Edad</TableCell>
                                                    <TableCell>Discapacidad</TableCell>
                                                    <TableCell>Descripción</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {personas.map((p, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{i + 1}</TableCell>
                                                        <TableCell>{p.nombre}</TableCell>
                                                        <TableCell>{p.apellido}</TableCell>
                                                        <TableCell>{p.edad}</TableCell>
                                                        <TableCell>{p.discapacidad ? 'Sí' : 'No'}</TableCell>
                                                        <TableCell>{p.discapacidad ? p.descripcionDiscapacidad : 'N/A'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Collapse>
                            </Grid>
                        </Slide>
                    );
                })}
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Layout>
    );
}

export default VerReservas;
