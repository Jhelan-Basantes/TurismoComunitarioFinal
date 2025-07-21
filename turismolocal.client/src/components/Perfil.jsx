// src/components/Perfil.jsx
import React, { useContext, useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    Avatar,
    Divider,
    CircularProgress,
    Alert,
    Grid,
    IconButton
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../context/AuthContext';

export default function Perfil() {
    const { usuario, logout } = useContext(AuthContext);
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPerfil = async () => {
            if (!usuario || !usuario.token) {
                setError('No hay usuario autenticado.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`https://localhost:7224/api/usuarios/perfil`, {
                    headers: {
                        'Authorization': `Bearer ${usuario.token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('No se pudo obtener el perfil del usuario.');
                }

                const data = await res.json();
                setPerfil(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [usuario]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!perfil) return null;

    const renderCard = (label, value) => (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {label}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1">{value || '—'}</Typography>
                </Grid>
            </Grid>
        </Paper>
    );

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 2
        }}>
            <Paper elevation={4} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 64, height: 64 }}>
                        <AssignmentIndIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h5">{perfil.username}</Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {renderCard('Correo', perfil.email)}
                {renderCard('Teléfono', perfil.telefono)}
                {renderCard('Rol', perfil.role)}

                {/* Logout */}
                <Paper elevation={1} sx={{ p: 2, mb: 1 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Cerrar sesión
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton color="error" onClick={logout}>
                                <LogoutIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
            </Paper>
        </Box>
    );
}
