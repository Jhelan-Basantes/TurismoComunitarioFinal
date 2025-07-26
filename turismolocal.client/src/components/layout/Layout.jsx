/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este componente Layout actúa como una plantilla estructural principal para las páginas del sitio.
 * Integra de manera coherente la barra de navegación (Navbar), el contenido dinámico (children)
 * y el pie de página (Footer) en una estructura fija.
 *
 * Props:
 * - children: contenido dinámico que será renderizado entre Navbar y Footer.
 * - toggleTheme: función que permite alternar entre modo claro y oscuro.
 * - modoOscuro: booleano que indica si el tema actual es oscuro.
 * 
 * Funcionalidad:
 * - Proporciona una estructura consistente para todas las páginas.
 * - Facilita la reutilización de elementos comunes como Navbar y Footer.
 * - Permite la gestión del tema visual desde la barra de navegación.
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

            {/* Contenido principal */}
            <main
                style={{
                    padding: '1rem',
                    minHeight: 'calc(100vh - 128px)', // Altura total menos Navbar y Footer
                    fontFamily: 'inherit'
                }}
            >
                {children}
            </main>

            {/* Footer incluido una sola vez aquí */}
            <Footer />
        </>
    );
};

export default Layout;
