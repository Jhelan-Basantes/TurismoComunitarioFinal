import React, { useState, useContext} from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import {
    Container,
    Typography,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
    InputAdornment,
    Box
} from '@mui/material';

import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { LoadingButton } from '@mui/lab';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CircularProgress } from '@mui/material';

import confetti from 'canvas-confetti';

function Pagos() {
    const { usuario } = useContext(AuthContext);
    const location = useLocation();
    const reserva = location.state;

    const [montoIngresado, setMontoIngresado] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const [mensajeFinal, setMensajeFinal] = useState('');


    if (!reserva) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">No hay información de reserva. Regrese e intente de nuevo.</Alert>
            </Container>
        );
    }

    const lanzarConfetti = () => {
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 }
        });
    };

    const handlePago = async () => {
        const montoFloat = parseFloat(montoIngresado);

        if (
            !montoIngresado ||
            isNaN(montoFloat) ||
            montoFloat <= 0 ||
            montoFloat !== reserva.valorTotal
        ) {
            setMensajeFinal(`Debe ingresar exactamente el valor total de la reserva: $${reserva.valorTotal.toFixed(2)}`);
            return;
        }

        const reservaPayload = {
            usuarioId: reserva.usuarioId,
            lugarId: reserva.lugarId,
            cantidadPersonas: reserva.cantidadPersonas,
            discapacidad: reserva.discapacidad,
            tiempoInicio: new Date(reserva.tiempoInicio).toISOString(),
            tiempoFin: new Date(reserva.tiempoFin).toISOString(),
            personasJson: JSON.stringify(reserva.personas)
        };

        try {
            const resReserva = await fetch('https://localhost:7224/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario?.token}`
                },
                body: JSON.stringify(reservaPayload)
            });

            if (!resReserva.ok) {
                const data = await resReserva.json();
                throw new Error(data.mensaje || 'Error al crear la reserva.');
            }

            const reservaCreada = await resReserva.json();

            const pagoPayload = {
                reservaId: reservaCreada.id,
                monto: montoFloat,
                metodoPago: metodoPago,
                estadoPago: 'Completado'
            };

            const resPago = await fetch('https://localhost:7224/api/pagos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario?.token}`
                },
                body: JSON.stringify(pagoPayload)
            });

            if (!resPago.ok) {
                const data = await resPago.json();
                throw new Error(data.mensaje || 'Error al registrar el pago.');
            }

            setPagoExitoso(true);
            lanzarConfetti();
            setMensajeFinal('¡Pago registrado y reserva confirmada con éxito!');

        } catch (error) {
            console.error(error);
            setMensajeFinal(error.message);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    <PaymentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Confirmar Pago
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Valor Total de la Reserva:</strong> ${reserva.valorTotal.toFixed(2)}
                </Alert>

                <Typography variant="h6" gutterBottom>
                    <PeopleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Personas que asistirán:
                </Typography>

                <List dense sx={{ mb: 3 }}>
                    {reserva.personas.map((p, i) => (
                        <React.Fragment key={i}>
                            <ListItem>
                                <ListItemText
                                    primary={`${p.nombre} ${p.apellido} - Edad: ${p.edad}`}
                                    secondary={
                                        p.discapacidad
                                            ? `Discapacidad: ${p.descripcionDiscapacidad || 'N/A'}`
                                            : null
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Método de Pago</InputLabel>
                    <Select
                        value={metodoPago}
                        label="Método de Pago"
                        onChange={(e) => setMetodoPago(e.target.value)}
                        startAdornment={<CreditCardIcon sx={{ mr: 1 }} />}
                    >
                        <MenuItem value="Tarjeta de Crédito">Tarjeta de Crédito</MenuItem>
                        <MenuItem value="Transferencia Bancaria">Transferencia Bancaria</MenuItem>
                        <MenuItem value="Efectivo">Efectivo</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    type="number"
                    label="Ingrese el valor a pagar"
                    value={montoIngresado}
                    onChange={(e) => setMontoIngresado(e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{ mb: 4 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AttachMoneyIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <LoadingButton
                    variant="contained"
                    color={pagoExitoso ? "success" : "primary"}
                    loading={isProcessing}
                    loadingIndicator={<CircularProgress size={24} color="inherit" />}
                    startIcon={pagoExitoso ? <CheckCircleIcon /> : <PaymentIcon />}
                    onClick={async () => {
                        setMensajeFinal('');
                        setIsProcessing(true);
                        await handlePago();
                        setIsProcessing(false);
                    }}
                    sx={{
                        mt: 2,
                        fontWeight: 'bold',
                        paddingX: 3,
                        paddingY: 1.2,
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        boxShadow: 3,
                        '&:hover': {
                            boxShadow: 6,
                            transform: 'scale(1.03)',
                        },
                    }}
                >
                    {pagoExitoso ? 'Pago Confirmado' : 'Registrar Pago y Confirmar Reserva'}
                </LoadingButton>

                {mensajeFinal && (
                    <Alert
                        severity={pagoExitoso ? 'success' : 'warning'}
                        sx={{ mt: 4 }}
                    >
                        {mensajeFinal}
                    </Alert>
                )}
            </Paper>
        </Container>
    );
}

export default Pagos;
 