/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.
 * Fecha: 22/07/2025
 *
 * Descripción general:
 * Este archivo configura dos temas personalizados para la aplicación "Turismo Comunitario"
 * utilizando Material UI (MUI). Define un tema claro y uno oscuro para ofrecer una experiencia
 * visual coherente y adaptable a las preferencias del usuario.
 *
 * Detalles:
 * - Cada tema especifica su paleta de colores (fondo, texto, colores primarios y secundarios).
 * - Se establece el modo (light u dark) para activar estilos correspondientes en MUI.
 * - La tipografía base es 'Poppins' para mantener la identidad visual en ambos temas.
 * 
 * Uso:
 * Estos temas pueden ser usados con el ThemeProvider de MUI para aplicar estilos globales
 * según la preferencia o configuración del usuario.
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
