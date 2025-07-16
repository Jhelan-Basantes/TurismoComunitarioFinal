import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import Layout from '../components/layout/Layout';

function Pagos() {
    const location = useLocation();
    const navigate = useNavigate();
    const reserva = location.state;

    const [metodoPago, setMetodoPago] = useState('');

    const handlePago = async () => {
        if (!metodoPago) {
            alert('Seleccione un método de pago');
            return;
        }

        // Verificar que reservaId exista
        if (!reserva.id && !reserva.reservaId) {
            alert('No se encontró el ID de la reserva. Primero debe crear la reserva.');
            return;
        }

        const pago = {
            reservaId: reserva.id ?? reserva.reservaId,
            monto: reserva.valorTotal,
            metodoPago: metodoPago,
            estadoPago: "Completado"
            // No se incluye fechaPago porque el backend puede asignarla automáticamente
        };

        try {
            const res = await fetch('https://localhost:7224/api/pagos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pago)
            });

            if (res.ok) {
                alert('Pago registrado correctamente');
                navigate('/');
            } else {
                const msg = await res.text();
                alert('Error al registrar el pago: ' + msg);
            }
        } catch (err) {
            alert('Error de red: ' + err);
        }
    };

    return (
        <Layout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Confirmar Pago</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Resumen de Reserva</Typography>
                                <Typography><strong>Lugar ID:</strong> {reserva.lugarId}</Typography>
                                <Typography><strong>Personas:</strong> {reserva.cantidadPersonas}</Typography>
                                <Typography><strong>Desde:</strong> {new Date(reserva.tiempoInicio).toLocaleString()}</Typography>
                                <Typography><strong>Hasta:</strong> {new Date(reserva.tiempoFin).toLocaleString()}</Typography>
                                <Typography><strong>Mascotas:</strong> {reserva.llevaMascotas ? 'Sí' : 'No'}</Typography>
                                <Typography><strong>Discapacidad:</strong> {reserva.discapacidad ? 'Sí' : 'No'}</Typography>
                                <Typography><strong>Total a Pagar:</strong> ${reserva.valorTotal}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Método de Pago</Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="metodo-pago-label">Método de pago</InputLabel>
                                    <Select
                                        labelId="metodo-pago-label"
                                        value={metodoPago}
                                        onChange={(e) => setMetodoPago(e.target.value)}
                                        label="Método de pago"
                                    >
                                        <MenuItem value="">-- Seleccione --</MenuItem>
                                        <MenuItem value="Transferencia">Transferencia</MenuItem>
                                        <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                                    </Select>
                                </FormControl>
                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handlePago}
                                        disabled={!metodoPago}
                                    >
                                        Confirmar Pago
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}

export default Pagos;
