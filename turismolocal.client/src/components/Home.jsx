import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function Home() {
    return (
        <div>
            {/* Encabezado verde que ocupa toda la altura visible */}
            <div
                className="bg-success text-white d-flex flex-column justify-content-center align-items-center text-center"
                style={{ height: '20vh' }}
            >
                <h1 className="display-4">Turismo Comunitario</h1>
                <p className="fs-4">¡Visita todo lo que tenemos por ofrecer!</p>
            </div>

            {/* Carrusel con margen superior para separarlo visualmente */}
            <Carousel className="mt-5">
                <Carousel.Item>
                    <h3 className="bg-dark bg-opacity-75 text-white py-2 rounded-top text-center">
                        Centro Cultural y Turístico Pucará Tambo
                    </h3>

                    <div className="d-flex align-items-center p-3">
                        <img
                            className="d-block"
                            src="https://img.goraymi.com/2017/06/29/6e907279ced5922fe43d1956fbb1f3d4_xl.jpg"
                            alt="Imagen 1"
                            style={{ width: '60%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div className="bg-dark bg-opacity-50 rounded text-white p-3 ms-3" style={{ flex: 1 }}>
                            <p>
                                El Centro Cultural y Turístico Pucará Tambo, con una imponente vista panorámica de Riobamba, ofrece la oportunidad de hospedarte en su comunidad para vivir experiencias culturales, gastronómicas y de aventura.
                            </p>
                        </div>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <h3 className="bg-dark bg-opacity-75 text-white py-2 rounded-top text-center">
                        Ubicación a 3.116 msnm en Cacha
                    </h3>

                    <div className="d-flex align-items-center p-3">
                        <img
                            className="d-block"
                            src="https://img.goraymi.com/2017/06/29/7f7bb6a0bc297851a5354eac5761cfd0_xl.jpg"
                            alt="Imagen 2"
                            style={{ width: '60%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div className="bg-dark bg-opacity-50 rounded text-white p-3 ms-3" style={{ flex: 1 }}>
                            <p>
                                El Centro Cultural y Turístico Pucará Tambo, se encuentra localizado a una altitud de 3.116 msnm en la parroquia rural Cacha a 11 km de Riobamba.
                            </p>
                        </div>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <h3 className="bg-dark bg-opacity-75 text-white py-2 rounded-top text-center">
                        Servicios Turísticos Consolidados
                    </h3>

                    <div className="d-flex align-items-center p-3">
                        <img
                            className="d-block"
                            src="https://img.goraymi.com/2017/06/29/431999099335f8d50cc43ecf0af4bee9_xl.jpg"
                            alt="Imagen 3"
                            style={{ width: '60%', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div className="bg-dark bg-opacity-50 rounded text-white p-3 ms-3" style={{ flex: 1 }}>
                            <p>
                                En el centro de servicios turísticos se brindan productos consolidados como hospedaje, alimentación, museo, artesanías y guía para los atractivos naturales y culturales del sector.
                            </p>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default Home;