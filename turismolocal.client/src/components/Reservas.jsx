// src/components/Reservas.jsx
import React, { useState } from 'react';

const lugares = [
    {
        id: 1,
        titulo: 'Pucará Tambo',
        personasRecomendadas: '2-6 personas',
        accesibleDiscapacitados: true
    },
    {
        id: 2,
        titulo: 'San Clemente Turismo Comunitario',
        personasRecomendadas: '4-10 personas',
        accesibleDiscapacitados: false
    },
    {
        id: 3,
        titulo: 'Isla Corazón',
        personasRecomendadas: '1-5 personas',
        accesibleDiscapacitados: false
    },
    {
        id: 4,
        titulo: 'Saraguro',
        personasRecomendadas: '2-8 personas',
        accesibleDiscapacitados: true
    }
];

function Reservas() {
    const [lugarSeleccionado, setLugarSeleccionado] = useState('');
    const [cantidadPersonas, setCantidadPersonas] = useState(1);
    const [personas, setPersonas] = useState([]);
    const [discapacidadGeneral, setDiscapacidadGeneral] = useState(false);
    const [tiempoInicio, setTiempoInicio] = useState('');
    const [tiempoFin, setTiempoFin] = useState('');
    const [excesoPersonas, setExcesoPersonas] = useState(false);

    const obtenerMaximoPersonas = (lugarTitulo) => {
        const lugar = lugares.find(l => l.titulo === lugarTitulo);
        if (lugar) {
            const partes = lugar.personasRecomendadas.split('-');
            if (partes.length === 2) {
                const max = parseInt(partes[1]);
                return isNaN(max) ? null : max;
            }
        }
        return null;
    };

    const handleLugarChange = (e) => {
        const nuevoLugar = e.target.value;
        setLugarSeleccionado(nuevoLugar);
        const maxPersonas = obtenerMaximoPersonas(nuevoLugar);
        setExcesoPersonas(maxPersonas && cantidadPersonas > maxPersonas);
    };

    const handleCantidadPersonasChange = (e) => {
        const cantidad = parseInt(e.target.value);
        setCantidadPersonas(cantidad);
        const maxPersonas = obtenerMaximoPersonas(lugarSeleccionado);
        setExcesoPersonas(maxPersonas && cantidad > maxPersonas);
        const nuevasPersonas = Array.from({ length: cantidad }, (_, i) => personas[i] || {
            nombre: '',
            apellido: '',
            edad: '',
            discapacidad: false
        });
        setPersonas(nuevasPersonas);
    };

    const handlePersonaChange = (index, campo, valor) => {
        const nuevasPersonas = [...personas];
        nuevasPersonas[index][campo] = valor;
        setPersonas(nuevasPersonas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (excesoPersonas) {
            alert('La cantidad de personas excede el máximo recomendado para este lugar.');
            return;
        }

        const reserva = {
            lugarSeleccionado,
            cantidadPersonas,
            discapacidadGeneral,
            tiempoInicio,
            tiempoFin,
            personasJson: JSON.stringify(personas)
        };

        try {
            const response = await fetch("https://localhost:7224/api/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reserva)
            });

            if (!response.ok) {
                const data = await response.json();
                console.error("Error del servidor:", data);
                alert("Error: " + (data.mensaje || "error desconocido"));
            } else {
                alert("Reserva enviada correctamente.");
            }
        } catch (error) {
            console.error("Error de red o conexión:", error);
            alert("No se pudo conectar al servidor.");
        };
    };

    return (
        <div className="container mt-4">
            <h1>Reservas</h1>
            <form onSubmit={handleSubmit}>
                {/* Selección de lugar */}
                <div className="mb-3">
                    <label htmlFor="lugar" className="form-label">Seleccione un lugar:</label>
                    <select
                        id="lugar"
                        className="form-select"
                        value={lugarSeleccionado}
                        onChange={handleLugarChange}
                        required
                    >
                        <option value="">-- Elija un lugar --</option>
                        {lugares.map((lugar) => (
                            <option key={lugar.id} value={lugar.titulo}>
                                {lugar.titulo} ({lugar.personasRecomendadas})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Cantidad de personas */}
                <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad de personas:</label>
                    <input
                        type="number"
                        id="cantidad"
                        className="form-control"
                        min="1"
                        max="20"
                        value={cantidadPersonas}
                        onChange={handleCantidadPersonasChange}
                        required
                    />
                    {excesoPersonas && (
                        <div className="alert alert-warning mt-2">
                            La cantidad de personas excede el máximo recomendado para este lugar.
                        </div>
                    )}
                </div>

                {/* Discapacidad general */}
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="discapacidadGeneral"
                        checked={discapacidadGeneral}
                        onChange={(e) => setDiscapacidadGeneral(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="discapacidadGeneral">
                        ¿Alguna persona tiene discapacidad?
                    </label>
                </div>

                {/* Tiempo */}
                <div className="mb-3">
                    <label className="form-label">Tiempo de visita (desde - hasta):</label>
                    <div className="d-flex gap-2">
                        <input
                            type="time"
                            className="form-control"
                            value={tiempoInicio}
                            onChange={(e) => setTiempoInicio(e.target.value)}
                            required
                        />
                        <span className="mx-2">a</span>
                        <input
                            type="time"
                            className="form-control"
                            value={tiempoFin}
                            onChange={(e) => setTiempoFin(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <hr />
                <h5>Datos de las personas:</h5>
                {personas.map((persona, index) => (
                    <div key={index} className="mb-3 border p-3 rounded">
                        <div className="mb-2">
                            <label className="form-label">Nombre:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={persona.nombre}
                                onChange={(e) => handlePersonaChange(index, 'nombre', e.target.value)}
                                required
                                minLength={2}
                                pattern="^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$"
                                title="Solo se permiten letras y espacios, mínimo 2 caracteres."
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Apellido:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={persona.apellido}
                                onChange={(e) => handlePersonaChange(index, 'apellido', e.target.value)}
                                required
                                minLength={2}
                                pattern="^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$"
                                title="Solo se permiten letras y espacios, mínimo 2 caracteres."
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Edad:</label>
                            <input
                                type="number"
                                className="form-control"
                                min="1"
                                max="120"
                                value={persona.edad}
                                onChange={(e) => handlePersonaChange(index, 'edad', e.target.value)}
                                required
                                title="Debe ser un número entre 1 y 120."
                            />
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`discapacidad-${index}`}
                                checked={persona.discapacidad}
                                onChange={(e) => handlePersonaChange(index, 'discapacidad', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor={`discapacidad-${index}`}>
                                ¿Tiene discapacidad?
                            </label>
                        </div>
                    </div>
                ))}

                <button type="submit" className="btn btn-primary mt-3">Enviar reserva</button>
            </form>
        </div>
    );
}

export default Reservas;