/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este archivo define dos temas personalizados (claro y oscuro) para la aplicación "Turismo Comunitario"
 * utilizando la biblioteca Material UI. Cada tema especifica la paleta de colores, el modo de visualización
 * y la tipografía base para asegurar una experiencia visual coherente y accesible.
 */

import { createTheme } from '@mui/material/styles';

// Tema para modo claro
export const lightTheme = createTheme({
    palette: {
        mode: 'light', // Indica el modo claro
        background: {
            default: '#FAFAFA', // Fondo general
            paper: '#FFFFFF',   // Fondo de elementos tipo papel (cards, formularios)
        },
        text: {
            primary: '#000000', // Color principal del texto
        },
        primary: {
            main: '#4A7766', // Color principal del tema (botones, enlaces activos, etc.)
        },
        secondary: {
            main: '#000000', // Color secundario para elementos complementarios
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif', // Fuente tipográfica base
    },
});

// Tema para modo oscuro
export const darkTheme = createTheme({
    palette: {
        mode: 'dark', // Indica el modo oscuro
        background: {
            default: '#312F2C', // Fondo general
            paper: '#383634',   // Fondo para componentes con superficie
        },
        text: {
            primary: '#FAFAFA', // Texto claro para contrastar con fondo oscuro
        },
        primary: {
            main: '#4A7766', // Color principal consistente con el tema claro
        },
        secondary: {
            main: '#FAFAFA', // Color secundario para íconos y elementos de contraste
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif', // Fuente consistente con modo claro
    },
});
