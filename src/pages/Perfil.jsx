import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import '../styles/Perfil.css';
import avatar from '../assets/foto.png';
import Nav from '../components/Nav';
import { ToastContainer, toast } from "react-toastify";
import { logout } from '../components/auth'; // importa el helper logout

const Perfil = () => {
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(); // llama al helper
            navigate("/login");
        } catch (error) {
            toast.error("Error al cerrar sesión", { position: "bottom-right" });
        }
    };

    return (
        <>
            <Nav />
            <div className="perfil-container">
                <div className="perfil-card">
                    <div className="perfil-header">
                        <img src={avatar} alt="Avatar" className="perfil-avatar" />
                        <h2 className="perfil-username">{username || 'Usuario'}</h2>
                    </div>

                    <div className="perfil-options">
                        <div className="perfil-option">
                            <FaShoppingBag className="perfil-icon" />
                            <span>Últimas compras</span>
                        </div>
                        <div className="perfil-option">
                            <FaEnvelope className="perfil-icon" />
                            <span>Cambiar correo</span>
                        </div>
                        <div className="perfil-option">
                            <FaLock className="perfil-icon" />
                            <span>Cambiar contraseña</span>
                        </div>
                        <div className="perfil-option logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <FaSignOutAlt className="perfil-icon" />
                            <span>Cerrar sesión</span>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer
                theme="colored"
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default Perfil;
