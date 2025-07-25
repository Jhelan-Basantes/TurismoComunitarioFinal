/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  Fecha: 22/07/2025
 *
 * Descripción general:
 * Este componente gestiona el formulario de registro de nuevos usuarios
 * en la aplicación Turismo Comunitario. Incluye campos para nombre de usuario,
 * correo, teléfono, contraseña y rol. Realiza una solicitud POST al backend
 * para crear un nuevo usuario. Muestra alertas de error en caso de fallos
 * y redirige al usuario a la pantalla de login tras un registro exitoso.
 */

import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Alert,
    Slide,
    Stack,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const navigate = useNavigate();

    // Estado local para almacenar los datos ingresados por el usuario
    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        telefono: '',
        role: 'Turista', // Rol por defecto
    });

    // Estado para controlar el mensaje de error y su visibilidad
    const [mensaje, setMensaje] = useState('');
    const [showMensaje, setShowMensaje] = useState(false);

    /**
     * handleChange: actualiza el estado 'form' en tiempo real conforme el usuario escribe.
     * Permite mantener sincronizados los campos del formulario con su representación en el estado.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * handleSubmit: envía los datos del formulario al backend usando una solicitud POST.
     * Si el registro es exitoso, redirige al usuario a la página de login.
     * En caso de error, muestra un mensaje contextual en el componente <Alert>.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setShowMensaje(false);

        try {
            const res = await fetch('https://localhost:7224/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                navigate('/login');
            } else {
                const data = await res.json();
                setMensaje(data.message || 'Error al registrarse');
                setShowMensaje(true);
            }
        } catch (error) {
            console.error('Error al registrarse:', error);
            setMensaje('Error de conexión con el servidor');
            setShowMensaje(true);
        }
    };

    return (
        <Layout>
            {/* Contenedor principal del formulario */}
            <Box
                sx={{
                    maxWidth: 450,
                    mx: 'auto',
                    mt: 6,
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
                component="form"
                onSubmit={handleSubmit}
            >
                {/* Encabezado del formulario con ícono */}
                <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                    <PersonAddIcon color="primary" fontSize="large" />
                    <Typography variant="h5" component="h2">
                        Registro de Usuario
                    </Typography>
                </Stack>

                {/* Alerta de error visible solo cuando showMensaje es true */}
                <Slide direction="down" in={showMensaje} mountOnEnter unmountOnExit>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {mensaje}
                    </Alert>
                </Slide>

                {/* Campo: Nombre de usuario */}
                <TextField
                    label="Nombre de usuario"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    inputProps={{ minLength: 3 }}
                />

                {/* Campo: Correo electrónico */}
                <TextField
                    label="Correo electrónico"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />

                {/* Campo: Teléfono (opcional) */}
                <TextField
                    label="Teléfono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Opcional"
                />

                {/* Campo: Contraseña */}
                <TextField
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    inputProps={{ minLength: 4 }}
                />

                {/* Campo: Rol (selector entre Turista y Guía) */}
                <TextField
                    label="Rol"
                    select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="Turista">Turista</MenuItem>
                    <MenuItem value="Guia">Guía</MenuItem>
                </TextField>

                {/* Botón de envío del formulario */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Registrarse
                </Button>
            </Box>
        </Layout>
    );
}

export default Registro;
