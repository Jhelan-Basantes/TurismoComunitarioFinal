/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Gua�a, Arely Pazmi�o
 * Versi�n: TurismoLocal v9.
 * Fecha: 22/07/2025
 *
 * Descripci�n general:
 * Componente que provee un contexto para la gesti�n del tema visual de la aplicaci�n.
 * Permite alternar entre modo claro y modo oscuro usando Material UI (MUI).
 * 
 * Funcionalidades:
 * - Controla el estado local `modoOscuro` para activar/desactivar el modo oscuro.
 * - Expone la funci�n `toggleTheme` para cambiar el modo.
 * - Utiliza `useMemo` para memorizar el tema personalizado y optimizar el rendimiento.
 * - Aplica globalmente el tema a trav�s de `ThemeProvider` de MUI.
 * - Incluye `CssBaseline` para normalizar estilos base y adaptarlos al tema activo.
 * - Proporciona el contexto `ThemeContext` para que cualquier componente descendiente
 *   pueda acceder al estado y funci�n para cambiar el tema.
 *
 * Uso:
 * Envolver la aplicaci�n o parte de ella con este componente para habilitar el soporte
 * din�mico de temas claros y oscuros.
 */

import React, { createContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
    const [modoOscuro, setModoOscuro] = useState(false);

    const toggleTheme = () => setModoOscuro(prev => !prev);

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: modoOscuro ? 'dark' : 'light',
                primary: { main: '#009688' }, // Color de acento
            },
            typography: {
                fontFamily: 'Poppins, sans-serif',
            },
        }), [modoOscuro]);

    return (
        <ThemeContext.Provider value={{ modoOscuro, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;
