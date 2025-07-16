// src/components/Perfil.jsx
import React, { useContext } from 'react';
import {
    Typography,
    Box,
    Paper,
    Avatar,
    Divider
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { AuthContext } from '../context/AuthContext';

export default function Perfil() {
    const { usuario } = useContext(AuthContext);

    if (!usuario) return null;

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            bgcolor: '#f5f5f5',
            p: 2
        }}>
            <Paper elevation={3} sx={{
                p: 4,
                maxWidth: 500,
                width: '100%',
                textAlign: 'center'
            }}>
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                    <AssignmentIndIcon sx={{ fontSize: 36 }} />
                </Avatar>

                <Typography variant="h5" gutterBottom>
                    Perfil de Usuario
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Nombre:</strong> {usuario.nombre}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Apellido:</strong> {usuario.apellido}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Correo:</strong> {usuario.email}
                </Typography>

                <Typography variant="body1">
                    <strong>Rol:</strong> {usuario.role}
                </Typography>
            </Paper>
        </Box>
    );
}
