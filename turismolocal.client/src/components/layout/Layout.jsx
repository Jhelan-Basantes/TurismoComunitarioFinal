// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, toggleTheme, modoOscuro }) => {
    return (
        <>
            <Navbar toggleTheme={toggleTheme} modoOscuro={modoOscuro} />
            <main style={{ padding: '1rem', minHeight: 'calc(100vh - 128px)', fontFamily: 'inherit' }}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
