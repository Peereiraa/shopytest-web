import React from 'react';
import Sidebar from '../components/Sidebar';
import Nav from '../components/Nav'; 

const Home = () => {
    return (
        <>
            <Sidebar />
            <Nav />
            {}
            <main style={{ paddingTop: '64px' }}>
                {/* Aquí tu contenido */}
                <h1>Bienvenido a Home</h1>
            </main>
        </>
    );
};

export default Home;
