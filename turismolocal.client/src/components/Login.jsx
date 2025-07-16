import React, { useState, useContext } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

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

                login(userData);
                localStorage.setItem('usuario', JSON.stringify(userData));
                navigate('/');
            } else {
                setMessage('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            setMessage('Error de conexión con el servidor.');
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
            <Card sx={{ width: 400, p: 2, boxShadow: 6 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center">
                        Iniciar Sesión
                    </Typography>

                    {message && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

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
                </CardContent>
            </Card>
        </Box>
    );
}

export default Login;
