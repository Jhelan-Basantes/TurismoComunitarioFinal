import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Catalogo() {
    const navigate = useNavigate();

    const lugares = [
        {
            id: 1,
            titulo: 'Pucar� Tambo',
            imagen: 'https://img.goraymi.com/2017/06/29/7f7bb6a0bc297851a5354eac5761cfd0_xl.jpg',
            descripcion: 'El Centro Cultural y Tur�stico Pucar� Tambo, con una imponente vista panor�mica de Riobamba.',
            descripcionCompleta: 'El Centro Cultural y Tur�stico Pucar� Tambo, con una imponente vista panor�mica de Riobamba, ofrece la oportunidad de hospedarte en su comunidad para vivir experiencias culturales, gastron�micas y de aventura.',
            valor: "20.00"
        },
        {
            id: 2,
            titulo: 'San Clemente Turismo Comunitario',
            imagen: 'https://img.goraymi.com/2018/05/31/6b70311a93767bd89ac476ef6efa6d26_xl.jpg',
            descripcion: 'La comunidad de San Clemente se encuentra ubicada al sur del cant�n Ibarra',
            descripcionCompleta: 'La comunidad de San Clemente se encuentra ubicada al sur del cant�n Ibarra, en la parroquia de La Esperanza a 30 minutos de la ciudad en las faldas del volc�n Imbabura. Su principal actividad productiva es la agricultura, se cultiva cereales, ma�z, fr�jol y tub�rculos.',
            valor: "30.00"
        },
        {
            id: 3,
            titulo: 'Isla Coraz�n',
            imagen: 'https://ec.viajandox.com/uploads/Isla%20Coraz%C3%B3n_1.jpg',
            descripcion: 'Ubicada frente a las costas de Bah�a de Car�quez, en la provincia de Manab�,',
            descripcionCompleta: 'Ubicada frente a las costas de Bah�a de Car�quez, en la provincia de Manab�, la Isla Coraz�n es una joya escondida del ecoturismo en Ecuador. Este islote en forma de coraz�n es un humedal protegido, hogar de una de las colonias m�s grandes de fragatas del Pac�fico.',
            valor: "35.00"
        },
        {
            id: 4,
            titulo: 'Saraguro',
            imagen: 'https://saraurku.com/wp-content/uploads/2025/01/Gera-y-trigo-dorado.jpg',
            descripcion: 'Descubre la magia de Ecuador a trav�s de experiencias aut�nticas que te conectan con la cultura y la naturaleza como nunca antes.',
            descripcionCompleta: 'Descubre la magia de Ecuador a trav�s de experiencias aut�nticas que te conectan con la cultura y la naturaleza como nunca antes. Sum�rgete en el legado vivo de pueblos y comunidades ancestrales, donde cada encuentro es un viaje a descubrir las ra�ces de su historia, espiritualidad, tradiciones y cosmovisi�n.',
            valor: "30.00"
        }
    ];

    const [expandedIds, setExpandedIds] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const toggleExpand = (id) => {
        if (expandedIds.includes(id)) {
            setExpandedIds(expandedIds.filter(eid => eid !== id));
        } else {
            setExpandedIds([...expandedIds, id]);
        }
    };

    const verDetalle = (id) => {
        navigate(`/lugar/${id}`);
    };

    // Filtra los lugares seg�n la b�squeda en t�tulo o descripci�n (minusculas para que sea case insensitive)
    const lugaresFiltrados = lugares.filter(lugar =>
        lugar.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        lugar.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2>Cat�logo</h2>

            {/* Buscador */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar lugar por palabra clave..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    aria-label="Buscar lugar"
                />
            </div>

            <div className="row">
                {lugaresFiltrados.length > 0 ? (
                    lugaresFiltrados.map(lugar => (
                        <div key={lugar.id} className="col-md-3">
                            <div className="card mb-4 shadow-sm">
                                <img
                                    src={lugar.imagen}
                                    className="card-img-top"
                                    alt={lugar.titulo}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{lugar.titulo}</h5>
                                    <p className="card-text">
                                        {expandedIds.includes(lugar.id)
                                            ? lugar.descripcionCompleta
                                            : lugar.descripcion.length > 100
                                                ? lugar.descripcion.slice(0, 100) + '...'
                                                : lugar.descripcion
                                        }
                                    </p>
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={() => toggleExpand(lugar.id)}
                                    >
                                        {expandedIds.includes(lugar.id) ? 'Ver menos' : 'Ver m�s'}
                                    </button>

                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <small className="text-muted">Valor: ${lugar.valor}</small>
                                    </div>

                                    <div className="d-grid mt-2">
                                        <button
                                            className="btn btn-primary"
                                            aria-label={`Ver detalle de ${lugar.titulo}`}
                                            onClick={() => verDetalle(lugar.id)}
                                        >
                                            Ver detalle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron resultados para "{busqueda}"</p>
                )}
            </div>
        </div>
    );
}

export default Catalogo;