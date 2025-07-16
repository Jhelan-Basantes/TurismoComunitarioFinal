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
    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        role: 'Turista',
    });

    const [mensaje, setMensaje] = useState('');
    const [showMensaje, setShowMensaje] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

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
                <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                    <PersonAddIcon color="primary" fontSize="large" />
                    <Typography variant="h5" component="h2">
                        Registro de Usuario
                    </Typography>
                </Stack>

                <Slide direction="down" in={showMensaje} mountOnEnter unmountOnExit>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {mensaje}
                    </Alert>
                </Slide>

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
