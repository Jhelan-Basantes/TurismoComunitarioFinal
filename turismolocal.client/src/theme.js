// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light', // Cambia a 'dark' si quieres modo oscuro por defecto
        primary: {
            main: '#0B4B54', // Azul MUI por defecto, puedes cambiar
        },
        secondary: {
            main: '#ff4081', // Rosa fuerte
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;
