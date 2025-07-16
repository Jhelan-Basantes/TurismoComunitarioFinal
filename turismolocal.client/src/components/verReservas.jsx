import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import { AuthContext } from '../context/AuthContext';
import {
    Card, CardContent, Typography, Grid, Collapse,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Slide, Avatar, Snackbar, Alert, TextField, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    void expand;
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

    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState({
        cantidadPersonas: '',
        tiempoInicio: '',
        tiempoFin: ''
    });

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

    const handleEditClick = (reserva) => {
        setEditandoId(reserva.id);
        setFormData({
            cantidadPersonas: reserva.cantidadPersonas,
            tiempoInicio: new Date(reserva.tiempoInicio).toISOString().slice(0, 16),
            tiempoFin: new Date(reserva.tiempoFin).toISOString().slice(0, 16),
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const guardarCambios = async (id) => {
        try {
            const body = {
                ...reservas.find(r => r.id === id),
                cantidadPersonas: parseInt(formData.cantidadPersonas),
                tiempoInicio: formData.tiempoInicio,
                tiempoFin: formData.tiempoFin
            };

            const res = await fetch(`https://localhost:7224/api/reservas`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${usuario?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error(await res.text());

            setReservas(prev =>
                prev.map(r => (r.id === id ? { ...r, ...body } : r))
            );
            setSnackbar({ open: true, message: 'Reserva actualizada', severity: 'success' });
            setEditandoId(null);
        } catch (err) {
            setSnackbar({ open: true, message: `Error: ${err.message}`, severity: 'error' });
        }
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
                                        {editandoId === r.id ? (
                                            <Box sx={{ mt: 1 }}>
                                                <TextField
                                                    name="cantidadPersonas"
                                                    label="Personas"
                                                    type="number"
                                                    value={formData.cantidadPersonas}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    sx={{ mb: 1 }}
                                                />
                                                <TextField
                                                    name="tiempoInicio"
                                                    label="Inicio"
                                                    type="datetime-local"
                                                    value={formData.tiempoInicio}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    sx={{ mb: 1 }}
                                                />
                                                <TextField
                                                    name="tiempoFin"
                                                    label="Fin"
                                                    type="datetime-local"
                                                    value={formData.tiempoFin}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                />
                                            </Box>
                                        ) : (
                                            <>
                                                <Typography variant="body2">Personas: {r.cantidadPersonas}</Typography>
                                                <Typography variant="body2">Inicio: {new Date(r.tiempoInicio).toLocaleString()}</Typography>
                                                <Typography variant="body2">Fin: {new Date(r.tiempoFin).toLocaleString()}</Typography>
                                            </>
                                        )}
                                    </CardContent>

                                    <IconButton onClick={() => eliminarReserva(r.id)} disabled={eliminandoId === r.id}>
                                        <DeleteIcon color="error" />
                                    </IconButton>

                                    {editandoId === r.id ? (
                                        <>
                                            <IconButton onClick={() => guardarCambios(r.id)}>
                                                <SaveIcon color="success" />
                                            </IconButton>
                                            <IconButton onClick={() => setEditandoId(null)}>
                                                <CloseIcon color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton onClick={() => handleEditClick(r)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    )}

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
