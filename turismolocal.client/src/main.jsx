/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Archivo principal de entrada para la aplicación React "Turismo Comunitario".
 * 
 * Funcionalidad:
 * - Monta el componente raíz <App /> dentro del elemento HTML con id 'root'.
 * - Utiliza React.StrictMode para ayudar a identificar problemas potenciales en el desarrollo.
 * - Importa y carga la familia tipográfica 'Poppins' en sus variantes 300, 400 y 600 para mantener
 *   la coherencia visual y estética en toda la aplicación.
 * 
 * Notas:
 * ReactDOM.createRoot es la API recomendada en React 18 para la creación de la raíz de la aplicación.
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
