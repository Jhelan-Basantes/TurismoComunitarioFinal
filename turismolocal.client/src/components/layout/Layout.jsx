/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente Layout actúa como una plantilla estructural principal para las páginas del sitio.
 * Integra de manera coherente la barra de navegación (Navbar), el contenido dinámico (children)
 * y, aunque no se visualiza directamente aquí, se espera que el pie de página (Footer) esté incluido en alguna parte superior del árbol de componentes o en otro Layout extendido.
 * Permite también alternar entre modo claro y oscuro mediante props.
 */

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Componente Layout
 * 
 * Props:
 * - children: contenido dinámico que será renderizado entre Navbar y Footer.
 * - toggleTheme: función que permite alternar entre modo claro y oscuro.
 * - modoOscuro: booleano que indica si el tema actual es oscuro.
 */
const Layout = ({ children, toggleTheme, modoOscuro }) => {
    return (
        <>
            {/* Barra de navegación superior con soporte para cambio de tema */}
            <Navbar toggleTheme={toggleTheme} modoOscuro={modoOscuro} />

            {/* Contenido principal. Se asegura un mínimo de altura para mantener el footer al final */}
            <main
                style={{
                    padding: '1rem',
                    minHeight: 'calc(100vh - 128px)',  // Compensa altura del Navbar + Footer
                    fontFamily: 'inherit'
                }}
            >
                {children}
            </main>

            {/* El componente Footer está importado pero no se utiliza aquí. 
                Se asume su inclusión en otro nivel del componente. */}
        </>
    );
};

export default Layout;
