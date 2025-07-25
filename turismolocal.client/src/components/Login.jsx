/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  Fecha: 22/07/2025
 * 
 * Descripción:
 * Componente de inicio de sesión que permite a los usuarios autenticarse en el sistema.
 * Valida credenciales contra la API backend y gestiona el contexto de autenticación.
 * Si el usuario es autenticado correctamente, se guarda su información en localStorage
 * y se redirige a la página principal.
 */

import React, { useState, useContext } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
    Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    // Estados locales para almacenar los datos del formulario y mensajes de error
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate(); // Hook de navegación para redirección
    const { login } = useContext(AuthContext); // Función del contexto para iniciar sesión

    /**
     * Maneja el envío del formulario de login.
     * Realiza una petición POST a la API de autenticación.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga por defecto del formulario

        try {
            const res = await fetch('https://localhost:7224/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                const userData = {
                    id: data.id,
                    username: data.username,
                    role: data.role,
                    token: data.token,
                };

                login(userData); // Guarda los datos en el contexto global
                localStorage.setItem('usuario', JSON.stringify(userData)); // Persistencia local
                navigate('/'); // Redirige al home
            } else {
                setMessage('Usuario o contraseña incorrectos'); // Mensaje para errores de login
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setMessage('Error de conexión con el servidor.'); // Error de red o servidor caído
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                bgcolor: '#f0f4f8',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* Tarjeta que contiene el formulario de inicio de sesión */}
            <Card sx={{ width: 400, p: 2, boxShadow: 6 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center">
                        Iniciar Sesión
                    </Typography>

                    {/* Muestra mensaje de error si lo hay */}
                    {message && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    {/* Formulario controlado */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth
                            label="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Entrar
                        </Button>
                    </Box>

                    {/* Enlace para registro de nuevos usuarios */}
                    <Stack direction="row" justifyContent="center" mt={2}>
                        <Typography variant="body2">
                            ¿No tienes cuenta?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate('/registro')}
                                sx={{ textDecoration: 'underline' }}
                            >
                                Regístrate
                            </Link>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;
