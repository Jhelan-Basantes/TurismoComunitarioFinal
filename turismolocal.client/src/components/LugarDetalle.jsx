import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const lugares = [
    {
        id: 1,
        titulo: 'Pucará Tambo',
        imagen: 'https://img.goraymi.com/2017/06/29/7f7bb6a0bc297851a5354eac5761cfd0_xl.jpg',
        descripcionCompleta: 'El Centro Cultural y Turístico Pucará Tambo, con una imponente vista panorámica de Riobamba, ofrece la oportunidad de hospedarte en su comunidad para vivir experiencias culturales, gastronómicas y de aventura.',
        valor: "20.00",
        personasRecomendadas: '2-6 personas',
        horarios: '09:00 - 18:00',
        accesibleDiscapacitados: true,
        actividades: ['Tour cultural', 'Gastronomía local', 'Senderismo']
    },
    {
        id: 2,
        titulo: 'San Clemente Turismo Comunitario',
        imagen: 'https://img.goraymi.com/2018/05/31/6b70311a93767bd89ac476ef6efa6d26_xl.jpg',
        descripcionCompleta: 'La comunidad de San Clemente se encuentra ubicada al sur del cantón Ibarra, en la parroquia de La Esperanza a 30 minutos de la ciudad en las faldas del volcán Imbabura. Su principal actividad productiva es la agricultura, se cultiva cereales, maíz, fréjol y tubérculos.',
        valor: "30.00",
        personasRecomendadas: '4-10 personas',
        horarios: '08:00 - 17:00',
        accesibleDiscapacitados: false,
        actividades: ['Visita a cultivos', 'Experiencia agrícola']
    },
    {
        id: 3,
        titulo: 'Isla Corazón',
        imagen: 'https://ec.viajandox.com/uploads/Isla%20Coraz%C3%B3n_1.jpg',
        descripcionCompleta: 'Ubicada frente a las costas de Bahía de Caráquez, en la provincia de Manabí, la Isla Corazón es una joya escondida del ecoturismo en Ecuador. Este islote en forma de corazón es un humedal protegido, hogar de una de las colonias más grandes de fragatas del Pacífico.',
        valor: "35.00",
        personasRecomendadas: '1-5 personas',
        horarios: '07:00 - 16:00',
        accesibleDiscapacitados: false,
        actividades: ['Observación de aves', 'Paseo en bote', 'Ecoturismo']
    },
    {
        id: 4,
        titulo: 'Saraguro',
        imagen: 'https://saraurku.com/wp-content/uploads/2025/01/Gera-y-trigo-dorado.jpg',
        descripcionCompleta: 'Descubre la magia de Ecuador a través de experiencias auténticas que te conectan con la cultura y la naturaleza como nunca antes. Sumérgete en el legado vivo de pueblos y comunidades ancestrales, donde cada encuentro es un viaje a descubrir las raíces de su historia, espiritualidad, tradiciones y cosmovisión.',
        valor: "30.00",
        personasRecomendadas: '2-8 personas',
        horarios: '10:00 - 19:00',
        accesibleDiscapacitados: true,
        actividades: ['Tour cultural', 'Artesanías tradicionales']
    }
];

function DetalleLugar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const lugar = lugares.find(l => l.id === parseInt(id));

    if (!lugar) {
        return <p className="mt-4">Lugar no encontrado.</p>;
    }

    return (
        <div className="container mt-4">
            <button
                className="btn btn-secondary mb-3"
                onClick={() => navigate('/catalogo')}
                aria-label="Volver al catálogo"
            >
                &larr; Volver al catálogo
            </button>

            <h2>{lugar.titulo}</h2>
            <img src={lugar.imagen} alt={lugar.titulo} className="img-fluid mb-3" />
            <p>{lugar.descripcionCompleta}</p>

            <p><strong>Valor:</strong> ${lugar.valor}</p>
            <p><strong>Personas recomendadas:</strong> {lugar.personasRecomendadas}</p>
            <p><strong>Horarios:</strong> {lugar.horarios}</p>
            <p>
                <strong>Accesible para personas discapacitadas:</strong>{' '}
                {lugar.accesibleDiscapacitados ? 'Sí' : 'No'}
            </p>

            <div>
                <strong>Actividades:</strong>
                <ul>
                    {lugar.actividades.map((actividad, index) => (
                        <li key={index}>{actividad}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default DetalleLugar;