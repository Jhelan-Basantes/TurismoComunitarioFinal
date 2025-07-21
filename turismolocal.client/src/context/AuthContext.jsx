import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            setUsuario(JSON.parse(storedUser));
        }
    }, []);

    const login = (user) => {
        setUsuario(user);
        localStorage.setItem("usuario", JSON.stringify(user));
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem("usuario");
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
