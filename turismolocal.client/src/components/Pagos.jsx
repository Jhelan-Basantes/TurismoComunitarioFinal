// Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño 
// Versión: TurismoLocal v9.  
// Fecha: 22/07/2025
// 
// Descripción general del componente:
// El componente `Pagos` permite al usuario confirmar y registrar el pago asociado a una reserva turística.
// Muestra la información de los participantes, permite seleccionar el método de pago e ingresar el monto correspondiente.
// Valida que el monto ingresado coincida con el valor total de la reserva, y luego realiza una petición POST para
// registrar tanto la reserva como su pago en el backend. Si todo es exitoso, se muestra una animación de confetti
// y un mensaje de confirmación.

import React, { useState, useContext } from 'react';
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
    const { usuario } = useContext(AuthContext); // Se obtiene el usuario autenticado del contexto
    const location = useLocation(); // Hook para acceder a la navegación
    const reserva = location.state; // Se accede a los datos de la reserva pasados por navegación

    // Estados locales para controlar el formulario
    const [montoIngresado, setMontoIngresado] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [isProcessing, setIsProcessing] = useState(false);
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const [mensajeFinal, setMensajeFinal] = useState('');

    // Validación: Si no se recibe información de la reserva, se muestra un mensaje de error
    if (!reserva) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">No hay información de reserva. Regrese e intente de nuevo.</Alert>
            </Container>
        );
    }

    // Animación visual que se ejecuta cuando el pago se realiza exitosamente
    const lanzarConfetti = () => {
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 }
        });
    };

    // Función principal que realiza la validación del pago y envía las peticiones al backend
    const handlePago = async () => {
        const montoFloat = parseFloat(montoIngresado);

        // Validación estricta del monto
        if (
            !montoIngresado ||
            isNaN(montoFloat) ||
            montoFloat <= 0 ||
            montoFloat !== reserva.valorTotal
        ) {
            setMensajeFinal(`Debe ingresar exactamente el valor total de la reserva: $${reserva.valorTotal.toFixed(2)}`);
            return;
        }

        // Construcción del payload de la reserva
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
            // Registro de la reserva en el backend
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

            // Construcción del payload para el registro del pago
            const pagoPayload = {
                reservaId: reservaCreada.id,
                monto: montoFloat,
                metodoPago: metodoPago,
                estadoPago: 'Completado'
            };

            // Registro del pago en el backend
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

            // Confirmación exitosa del proceso
            setPagoExitoso(true);
            lanzarConfetti();
            setMensajeFinal('¡Pago registrado y reserva confirmada con éxito!');

        } catch (error) {
            console.error(error);
            setMensajeFinal(error.message);
        }
    };

    // Renderizado del formulario de pago y confirmación
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

                {/* Lista de personas registradas en la reserva */}
                <List dense sx={{ mb: 3 }}>
                    {reserva.personas.map((p, i) => (
                        <React.Fragment key={i}>
                            <ListItem>
                                <ListItemText
                                    primary={`${p.nombre} ${p.apellido} - Edad: ${p.edad}`}
                                    secondary={p.discapacidad ? `Discapacidad: ${p.descripcionDiscapacidad || 'N/A'}` : null}
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>

                {/* Selección del método de pago */}
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

                {/* Campo para ingresar el monto a pagar */}
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

                {/* Botón de acción para confirmar el pago */}
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

                {/* Mensaje de estado final del proceso */}
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
