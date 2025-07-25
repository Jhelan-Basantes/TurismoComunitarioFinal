/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente Footer representa el pie de página de la aplicación web. 
 * Muestra un mensaje de derechos reservados con diseño centrado, respetando el tema (claro/oscuro) 
 * definido por MUI. Está pensado para mantenerse visualmente discreto y coherente con el estilo general del sitio.
 */

import { Box, Typography, useTheme } from '@mui/material';

/**
 * Componente Footer
 * 
 * Utiliza el sistema de temas de MUI para adaptar los colores del fondo y texto,
 * garantizando accesibilidad y consistencia en diferentes modos visuales.
 */
export default function Footer() {
    const theme = useTheme(); // Accede al tema actual (claro u oscuro)

    return (
        <Box
            sx={{
                mt: 4, // Margen superior
                py: 2, // Padding vertical
                textAlign: 'center',
                backgroundColor: theme.palette.background.paper, // Fondo acorde al tema
                color: theme.palette.text.secondary, // Color de texto acorde al tema
                fontFamily: 'inherit',
            }}
        >
            <Typography variant="body2" sx={{ fontFamily: 'inherit' }}>
                © 2025 Turismo Comunitario. Todos los derechos reservados.
            </Typography>
        </Box>
    );
}
