/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este archivo es el punto de entrada principal de la aplicación React "Turismo Comunitario".
 * Aquí se monta el componente raíz <App /> dentro del contenedor HTML con el ID 'root',
 * utilizando el modo estricto de React para detectar posibles problemas durante el desarrollo.
 * Además, se cargan las variantes de la fuente tipográfica 'Poppins' para mantener coherencia visual.
 */

// Importaciones principales de React
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importación del componente raíz de la aplicación
import App from './App';

// Carga de fuentes tipográficas 'Poppins' en distintos pesos (300, 400 y 600)
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';

// Renderizado del componente principal <App /> dentro del elemento con ID 'root'
// <React.StrictMode> activa comprobaciones adicionales en desarrollo
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
