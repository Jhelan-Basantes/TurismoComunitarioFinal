import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        role: 'Turista'
    });

    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');

        try {
            const res = await fetch('https://localhost:7224/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                navigate('/login');
            } else {
                const data = await res.json();
                setMensaje(data.message || 'Error al registrarse');
            }
        } catch (error) {
            console.error("Error al registrarse:", error);
            setMensaje('Error de conexión con el servidor');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2 className="mb-4 text-center">Registro de Usuario</h2>

            {mensaje && (
                <div className="alert alert-danger">{mensaje}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Nombre de usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        minLength={3}
                    />
                </div>

                <div className="mb-3">
                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={4}
                    />
                </div>

                <div className="mb-3">
                    <label>Rol</label>
                    <select
                        className="form-select"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="Turista">Turista</option>
                        <option value="Guia">Guía</option>
                    
                    </select>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Registro;
