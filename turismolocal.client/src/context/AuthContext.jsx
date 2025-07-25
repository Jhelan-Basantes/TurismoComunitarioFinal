/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.  
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este archivo define el contexto de autenticación de la aplicación "Turismo Comunitario".
 * Utiliza React Context API para almacenar y gestionar el estado de sesión del usuario.
 * Permite iniciar y cerrar sesión, y mantiene el estado persistente mediante localStorage.
 */

import React, { createContext, useState, useEffect } from 'react';

// Se crea el contexto de autenticación, que podrá ser consumido desde cualquier parte de la app
const AuthContext = createContext();

/**
 * Componente proveedor del contexto de autenticación.
 * Envuelve a toda la aplicación para proveer el estado de autenticación global.
 */
const AuthProvider = ({ children }) => {
    // Estado que representa al usuario autenticado actualmente
    const [usuario, setUsuario] = useState(null);

    /**
     * Efecto que se ejecuta al cargar el componente para verificar si hay
     * información de sesión almacenada previamente en el localStorage.
     */
    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            setUsuario(JSON.parse(storedUser));
        }
    }, []);

    /**
     * Función para iniciar sesión.
     * Guarda los datos del usuario en el estado y en el localStorage.
     */
    const login = (user) => {
        setUsuario(user);
        localStorage.setItem("usuario", JSON.stringify(user));
    };

    /**
     * Función para cerrar sesión.
     * Elimina los datos del usuario del estado y del localStorage.
     */
    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
    };

    return (
        // Proporciona los valores de usuario, login y logout a los componentes hijos
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
