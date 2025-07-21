// src/theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#FAFAFA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#000000',
        },
        primary: {
            main: '#4A7766',
        },
        secondary: {
            main: '#000000',
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#312F2C',
            paper: '#383634',
        },
        text: {
            primary: '#FAFAFA',
        },
        primary: {
            main: '#4A7766',
        },
        secondary: {
            main: '#FAFAFA',
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});
