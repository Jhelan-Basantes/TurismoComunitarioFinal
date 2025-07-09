import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [username, setUsername] = useState(localStorage.getItem("username") || "");

    const login = (user) => {
        setUsername(user);
        localStorage.setItem("username", user);
    };

    const logout = () => {
        setUsername("");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
