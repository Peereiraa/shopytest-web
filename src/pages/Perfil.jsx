import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaEnvelope,
    FaLock,
    FaSignOutAlt,
    FaShoppingBag,
    FaCamera
} from 'react-icons/fa';
import '../styles/Perfil.css';
import avatarDefault from '../assets/foto.png';
import Nav from '../components/Nav';
import { ToastContainer, toast } from "react-toastify";
import { logout } from '../components/auth';

const Perfil = () => {
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const [avatarSrc, setAvatarSrc] = useState(avatarDefault);
    const location = useLocation();

    useEffect(() => {
        if (!userId) return;

        fetch(`/api/users/${userId}/photo`)
        .then(res => {
                if (!res.ok) throw new Error('No se pudo obtener la foto');
                return res.json();
            })
            .then(data => {
                if (data.profilePhoto) setAvatarSrc(data.profilePhoto);
            })
            .catch(() => { });
    }, [userId]);

    useEffect(() => {
        if (location.state?.emailChanged) {
            toast.success("Correo actualizado correctamente", { position: "bottom-right" });
            window.history.replaceState({}, document.title); 
        }
    }, [location.state]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            toast.error("Error al cerrar sesión", { position: "bottom-right" });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result;
                setAvatarSrc(base64Image);

                // Guardar foto en backend
                if (!userId) {
                    toast.error("Usuario no identificado");
                    return;
                }

                fetch(`/api/users/${userId}/photo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ photo: base64Image })
                })
                    .then(res => {
                        if (!res.ok) throw new Error("Error guardando la foto");
                        return res.json();
                    })
                    .then(() => {
                        toast.success("Foto de perfil actualizada");
                    })
                    .catch(() => {
                        toast.error("Error al guardar la foto");
                    });
            };
            reader.readAsDataURL(file);
        } else {
            toast.error("Por favor selecciona una imagen válida.", { position: "bottom-right" });
        }
    };

    return (
        <>
            <Nav />
            <div className="perfil-container">
                <div className="perfil-card">
                    <div className="perfil-header">
                        <div className="avatar-wrapper">
                            <img src={avatarSrc} alt="Avatar" className="perfil-avatar" />
                            <label htmlFor="avatar-upload" className="camera-icon">
                                <FaCamera />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    hidden
                                />
                            </label>
                        </div>
                        <h2 className="perfil-username">{username || 'Usuario'}</h2>
                    </div>

                    <div className="perfil-options">
                        <div className="perfil-option">
                            <FaShoppingBag className="perfil-icon" />
                            <span>Últimas compras</span>
                        </div>
                        <div className="perfil-option" onClick={() => navigate("/cambiar-correo")}>
                            <FaEnvelope className="perfil-icon" />
                            <span>Cambiar correo</span>
                        </div>
                        <div className="perfil-option">
                            <FaLock className="perfil-icon" />
                            <span>Cambiar contraseña</span>
                        </div>
                        <div className="perfil-option logout" onClick={handleLogout}>
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
