import React, { useEffect, useState } from 'react';

function VerReservas() {
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Función para cargar reservas
    const cargarReservas = () => {
        setCargando(true);
        fetch('https://localhost:7224/api/reservas')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las reservas');
                return res.json();
            })
            .then(data => {
                setReservas(data);
                setCargando(false);
            })
            .catch(err => {
                setError(err.message);
                setCargando(false);
            });
    };

    useEffect(() => {
        cargarReservas();
    }, []);

    // Función para eliminar reserva
    const eliminarReserva = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta reserva?')) return;

        try {
            const response = await fetch(`https://localhost:7224/api/reservas/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la reserva');
            }

            // Recargar reservas después de eliminar
            cargarReservas();

        } catch (err) {
            alert(err.message);
        }
    };

    if (cargando) return <p>Cargando reservas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h1>Reservas realizadas</h1>
            {reservas.length === 0 ? (
                <p>No hay reservas realizadas.</p>
            ) : (
                reservas.map(r => {
                    let personas = [];
                    try {
                        personas = JSON.parse(r.personasJson);
                    } catch {
                        personas = [];
                    }

                    return (
                        <div key={r.id} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Reserva #{r.id} - {r.lugarSeleccionado}
                                    <button
                                        onClick={() => eliminarReserva(r.id)}
                                        style={{
                                            marginLeft: '15px',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </h5>
                                <p>
                                    <strong>Cantidad de personas:</strong> {r.cantidadPersonas}<br />
                                    <strong>Discapacidad general:</strong> {r.discapacidadGeneral ? 'Si' : 'No'}<br />
                                    <strong>Tiempo:</strong> {r.tiempoInicio} a {r.tiempoFin}<br />
                                    <strong>Fecha registro:</strong> {new Date(r.fechaRegistro).toLocaleString()}
                                </p>
                                <h6>Personas:</h6>
                                {personas.length === 0 ? (
                                    <p>No hay datos de personas.</p>
                                ) : (
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Apellido</th>
                                                <th>Edad</th>
                                                <th>Discapacidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {personas.map((p, i) => (
                                                <tr key={i}>
                                                    <td>{p.nombre}</td>
                                                    <td>{p.apellido}</td>
                                                    <td>{p.edad}</td>
                                                    <td>{p.discapacidad ? 'Si' : 'No'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default VerReservas;