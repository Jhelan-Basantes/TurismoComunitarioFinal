/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.
 * Fecha: 22/07/2025
 *
 * Descripción general:
 * Componente que muestra la información del perfil del usuario autenticado.
 * 
 * Funcionalidades:
 * - Obtiene los datos del perfil desde la API usando el token de autenticación.
 * - Muestra datos como usuario, correo electrónico, teléfono y rol.
 * - Maneja estados de carga y errores (por ejemplo, sesión expirada).
 * - Permite al usuario cerrar sesión mediante el contexto global AuthContext.
 * - Utiliza Material UI para diseño responsivo y componentes visuales.
 *
 * Consideraciones:
 * - Si el token es inválido o la sesión expira, muestra un mensaje indicando que debe iniciar sesión de nuevo.
 * - Previene el acceso a la vista perfil sin usuario autenticado.
 */

import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
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

                if (res.status === 401) {
                    // Token expirado o inválido
                    setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
                    // Opcional: logout automático después de mostrar mensaje
                    // logout();
                    setLoading(false);
                    return;
                }

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
    }, [usuario, logout]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Layout>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                p: 2
            }}>
                <Paper elevation={4} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
                    {/* Si hay error mostrar alerta */}
                    {error && (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Mostrar perfil solo si no hay error y hay datos */}
                    {!error && perfil && (
                        <>
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 64, height: 64 }}>
                                    <AssignmentIndIcon sx={{ fontSize: 36 }} />
                                </Avatar>
                                <Typography variant="h5">{perfil.username}</Typography>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Correo
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">{perfil.email || '—'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Teléfono
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">{perfil.telefono || '—'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Rol
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">{perfil.role || '—'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </>
                    )}

                    {/* Botón para cerrar sesión */}
                    <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
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
        </Layout>
    );
}
