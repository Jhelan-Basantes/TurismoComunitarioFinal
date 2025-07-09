import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ? Ruta corregida

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('https://localhost:7224/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();

                // Si el backend devuelve el nombre del usuario:
                login(data.username || username);  // ? usa el que venga del servidor, o el ingresado

                localStorage.setItem("token", data.token);
                navigate('/');
            } else {
                setMessage("Usuario o contrase\u00F1a incorrectos");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            setMessage("Error de conexión con el servidor.");
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Iniciar Sesi&oacute;n</h2>
            {message && <p style={{ color: 'red' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Usuario"
                    required
                /><br /><br />
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="Contrase&ntilde;a"
                    required
                /><br /><br />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;