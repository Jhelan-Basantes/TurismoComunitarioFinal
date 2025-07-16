// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer'; // si aún no tienes uno, puedes dejarlo comentado

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <main style={{ padding: '1rem', minHeight: 'calc(100vh - 128px)' }}>
                {children}
            </main>
            {/* <Footer /> */}
        </>
    );
};

export default Layout;

