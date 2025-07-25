/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 *
 * Descripción general:
 * Este componente representa la vista de detalle de un lugar turístico. 
 * Muestra información completa del lugar (imagen, descripción, precio, ubicación, guía asignado), 
 * permite realizar reservas, ver comentarios y publicar nuevas opiniones. 
 * Se conecta a múltiples endpoints de la API para obtener y enviar datos. 
 * También gestiona el comportamiento de usuario autenticado (comentarios, eliminación de opiniones).
 */

import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Divider,
    Rating,
    Alert,
    Stack
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function DetalleLugar() {
    // Obtiene el parámetro `id` de la URL para identificar el lugar a mostrar
    const { id } = useParams();

    // Hook de navegación para redireccionar entre rutas
    const navigate = useNavigate();

    // Accede al usuario autenticado desde el contexto global
    const { usuario } = useContext(AuthContext);

    // Estados para almacenar información relevante
    const [lugar, setLugar] = useState(null);               // Datos del lugar
    const [usuarios, setUsuarios] = useState([]);           // Lista de usuarios (para identificar autores de comentarios)
    const [opiniones, setOpiniones] = useState([]);         // Opiniones relacionadas con el lugar
    const [nuevoComentario, setNuevoComentario] = useState('');  // Comentario ingresado por el usuario
    const [nuevaCalificacion, setNuevaCalificacion] = useState(0); // Calificación ingresada por el usuario
    const [cargando, setCargando] = useState(true);         // Estado de carga inicial
    const [error, setError] = useState(null);               // Estado de error

    // Carga de datos al montar el componente
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Llamadas paralelas a tres endpoints
                const [resLugar, resUsuarios, resOpiniones] = await Promise.all([
                    fetch(`https://localhost:7224/api/lugares/${id}`),
                    fetch("https://localhost:7224/api/usuarios"),
                    fetch("https://localhost:7224/api/opiniones")
                ]);

                // Verificación de errores en las respuestas
                if (!resLugar.ok) throw new Error("No se encontró el lugar.");
                if (!resUsuarios.ok) throw new Error("Error al cargar usuarios.");
                if (!resOpiniones.ok) throw new Error("Error al cargar opiniones.");

                // Conversión a JSON
                const dataLugar = await resLugar.json();
                const dataUsuarios = await resUsuarios.json();
                const dataOpiniones = await resOpiniones.json();

                // Asignación de datos al estado
                setLugar(dataLugar);
                setUsuarios(dataUsuarios);
                setOpiniones(dataOpiniones.filter(op => op.lugarId === dataLugar.id));
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        fetchDatos();
    }, [id]);

    // Publica una nueva opinión del usuario autenticado
    const handlePublicar = async () => {
        if (!usuario) {
            alert("Por favor inicia sesión o regístrate para comentar.");
            navigate('/login');
            return;
        }

        if (nuevoComentario.trim() === "" || nuevaCalificacion < 1 || nuevaCalificacion > 5) {
            alert("Debes escribir un comentario y asignar una calificación de 1 a 5 estrellas.");
            return;
        }

        const opinionObj = {
            usuarioId: usuario.id,
            lugarId: lugar.id,
            comentario: nuevoComentario,
            calificacion: nuevaCalificacion,
            fecha: new Date().toISOString()
        };

        const res = await fetch("https://localhost:7224/api/opiniones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(opinionObj)
        });

        if (res.ok) {
            const createdOpinion = await res.json();
            setOpiniones([...opiniones, createdOpinion]);
            setNuevoComentario('');
            setNuevaCalificacion(0);
        } else {
            alert("Error al enviar la opinión.");
        }
    };

    // Elimina una opinión existente (acceso limitado por rol)
    const handleEliminar = async (opinionId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;

        const res = await fetch(`https://localhost:7224/api/opiniones/${opinionId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            setOpiniones(opiniones.filter(op => op.id !== opinionId));
        } else {
            alert("Error al eliminar el comentario.");
        }
    };

    // Manejo de estados iniciales (cargando, error, sin lugar)
    if (cargando) return <Typography variant="body1" mt={2}>Cargando...</Typography>;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    if (!lugar) return null;

    // Busca el usuario guía relacionado al lugar
    const guia = usuarios.find(u => u.id === lugar.idGuia);

    return (
        <Box sx={{ px: 4, py: 5 }}>
            {/* Botón para volver al catálogo */}
            <Button variant="outlined" onClick={() => navigate('/catalogo')} sx={{ mb: 3 }}>
                &larr; Volver al catálogo
            </Button>

            {/* Sección principal: Imagen + Información */}
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                {/* Tarjeta con imagen y descripción */}
                <Card sx={{ flex: 1 }}>
                    {lugar.imagenUrl && (
                        <CardMedia
                            component="img"
                            height="300"
                            image={lugar.imagenUrl}
                            alt={lugar.nombre}
                            sx={{ objectFit: 'cover' }}
                        />
                    )}
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {lugar.nombre}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {lugar.descripcion}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Tarjeta con detalles adicionales */}
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Información del Lugar
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Typography><strong>💲 Valor por persona:</strong> ${lugar.precio}</Typography>
                        <Typography><strong>📍 Ubicación:</strong> {lugar.ubicacion}</Typography>
                        <Typography><strong>🏷️ Categoría:</strong> {lugar.categoria || 'Sin categoría'}</Typography>
                        <Typography><strong>👤 Guía responsable:</strong> {guia ? guia.username : 'No asignado'}</Typography>

                        <Box mt={3}>
                            <Button variant="contained" onClick={() => navigate('/reservas/')}>
                                Reservar este lugar
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Sección de Comentarios */}
            <Box mt={5}>
                <Typography variant="h6" gutterBottom>Comentarios</Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Lista de comentarios existentes */}
                {opiniones.length === 0 ? (
                    <Typography>No hay comentarios todavía.</Typography>
                ) : (
                    <Stack spacing={2} mb={3}>
                        {opiniones.map((op) => {
                            const usuarioOp = usuarios.find(u => u.id === op.usuarioId);
                            const puedeEliminar = usuario && (
                                usuario.role === "Administrador" || usuario.role === "Guia"
                            );

                            return (
                                <Card key={op.id}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {usuarioOp ? usuarioOp.username : "Usuario desconocido"}
                                            </Typography>
                                            <Typography variant="caption">
                                                {new Date(op.fecha).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Rating value={op.calificacion} readOnly />
                                        <Typography mt={1}>{op.comentario}</Typography>
                                        {puedeEliminar && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                sx={{ mt: 1 }}
                                                onClick={() => handleEliminar(op.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>
                )}

                {/* Formulario para nuevo comentario */}
                {usuario ? (
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                Deja tu comentario
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Escribe tu opinión..."
                                variant="outlined"
                                value={nuevoComentario}
                                onChange={(e) => setNuevoComentario(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Typography><strong>Calificación:</strong></Typography>
                            <Rating
                                value={nuevaCalificacion}
                                onChange={(e, newValue) => setNuevaCalificacion(newValue)}
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained" onClick={handlePublicar}>
                                Publicar Comentario
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            ¿Quieres dejar un comentario?
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/login')}>
                            Inicia Sesión o Regístrate
                        </Button>
                    </Alert>
                )}
            </Box>
        </Box>
    );
}

export default DetalleLugar;
