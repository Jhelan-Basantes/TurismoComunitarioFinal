/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  Fecha: 22/07/2025
 *
 * Componente: Perfil.jsx
 * Descripción general:
 * Este componente permite visualizar el perfil del usuario autenticado dentro del sistema.
 * Obtiene los datos del usuario desde un endpoint protegido usando el token JWT y los
 * presenta de forma ordenada en tarjetas informativas. Incluye una opción para cerrar sesión.
 */

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
    const { usuario, logout } = useContext(AuthContext); // Accede a la sesión activa y función para cerrar sesión
    const [perfil, setPerfil] = useState(null);          // Estado que almacenará los datos del perfil del usuario
    const [loading, setLoading] = useState(true);        // Indicador de carga mientras se obtienen datos
    const [error, setError] = useState('');              // Mensaje de error si ocurre algún fallo

    // Efecto que se ejecuta al montar el componente para obtener el perfil del usuario
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
                        'Authorization': `Bearer ${usuario.token}` // Autenticación con token
                    }
                });

                if (!res.ok) {
                    throw new Error('No se pudo obtener el perfil del usuario.');
                }

                const data = await res.json();
                setPerfil(data); // Guarda los datos del perfil en el estado
            } catch (err) {
                setError(err.message); // Captura errores de red o de la API
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        fetchPerfil();
    }, [usuario]);

    // Mientras se cargan los datos, se muestra un indicador de carga
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    // En caso de error, se muestra un mensaje de advertencia
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    // Si no hay perfil cargado, no se renderiza nada
    if (!perfil) return null;

    // Función auxiliar para renderizar una tarjeta con un campo de perfil
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
                {/* Encabezado con ícono de usuario */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, width: 64, height: 64 }}>
                        <AssignmentIndIcon sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h5">{perfil.username}</Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Información del usuario en formato de tarjetas */}
                {renderCard('Correo', perfil.email)}
                {renderCard('Teléfono', perfil.telefono)}
                {renderCard('Rol', perfil.role)}

                {/* Botón para cerrar sesión */}
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
