/**
 * Autor: Jhelan Basantes, Sophia Chuquillangui, Esteban Guaña, Arely Pazmiño
 * Versión: TurismoLocal v9.
 * Fecha: 22/07/2025
 * 
 * Descripción general:
 * Este archivo define el contexto de autenticación para la aplicación "Turismo Comunitario".
 * Utiliza React Context API para gestionar el estado global de sesión del usuario,
 * permitiendo el inicio y cierre de sesión de forma centralizada.
 * 
 * Funcionalidades:
 * - Mantiene el estado del usuario autenticado en memoria y lo sincroniza con localStorage
 *   para persistencia entre recargas de página.
 * - Provee funciones `login` y `logout` para actualizar el estado y persistir los datos.
 * - Permite que cualquier componente consumidora acceda fácilmente a la información
 *   y acciones relacionadas con la autenticación mediante el contexto `AuthContext`.
 * 
 * Uso:
 * Envolver la aplicación con el componente `AuthProvider` para habilitar acceso al
 * contexto de autenticación en toda la aplicación.
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
