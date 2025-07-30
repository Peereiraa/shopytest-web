import React from 'react';
import Sidebar from '../components/Sidebar';
import Nav from '../components/Nav';
import '../styles/Home.css';
import foto from '../assets/foto.png';

export default function Home() {
    // Productos destacados hardcodeados
    const destacados = [
        { id: 1, nombre: "Chaqueta clásica", precio: "79.99€" },
        { id: 2, nombre: "Camiseta básica", precio: "19.99€" },
        { id: 3, nombre: "Pantalones vaqueros", precio: "49.99€" },
        { id: 4, nombre: "Vestido elegante", precio: "89.99€" },
    ];

    // Descuentos
    const descuentos = [
        { id: 1, nombre: "Descuento de verano", detalle: "Hasta 30% en prendas seleccionadas" },
        { id: 2, nombre: "Outlet", detalle: "Hasta 50% en stock limitado" },
    ];

    return (
        <>
            <Nav />
            <Sidebar />

            <main className="home-page">

                {/* Portada */}
                <section
                    className="hero-section"
                    style={{ backgroundImage: `url(${foto})` }}
                >
                    <div className="hero-overlay" />
                    <h1 className="hero-title">Tu estilo, tu tienda</h1>
                    <p className="hero-subtitle">Ropa con calidad y diseño para cada día</p>
                </section>

                {/* Productos destacados */}
                <section className="section destacados-section">
                    <h2>Productos destacados</h2>
                    <div className="productos-grid">
                        {destacados.map(({ id, nombre, precio }) => (
                            <div key={id} className="producto-card">
                                <img src={foto} alt={nombre} className="producto-img" />
                                <h3 className="producto-nombre">{nombre}</h3>
                                <p className="producto-precio">{precio}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sección de descuentos */}
                <section className="section descuentos-section">
                    <h2>Descuentos</h2>
                    <ul className="descuentos-list">
                        {descuentos.map(({ id, nombre, detalle }) => (
                            <li key={id} className="descuento-item">
                                <h3>{nombre}</h3>
                                <p>{detalle}</p>
                            </li>
                        ))}
                    </ul>
                </section>

            </main>
        </>
    );
}
