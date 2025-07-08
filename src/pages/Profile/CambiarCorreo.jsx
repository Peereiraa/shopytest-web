import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Perfil.css';
import Nav from '../../components/Nav';
import { toast, ToastContainer } from "react-toastify";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";

const CambiarCorreo = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [correoActual, setCorreoActual] = useState("");
    const [correoNuevo, setCorreoNuevo] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!correoActual || !correoNuevo || !password) {
            toast.error("Todos los campos son obligatorios", { position: "bottom-right" });
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/users/${userId}/change-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentEmail: correoActual,
                    newEmail: correoNuevo,
                    password: password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al cambiar el correo");
            }

            localStorage.setItem("userEmail", correoNuevo);

            navigate("/perfil", { state: { emailChanged: true } });

        } catch (err) {
            toast.error(err.message, { position: "bottom-right" });
        }
    };

    return (
        <>
            <Nav />
            <div className="perfil-container">
                <div className="perfil-card">
                    <div className="perfil-header">
                        <h2 className="perfil-username">Cambiar correo</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="form-cambiar-correo">
                        {}
                        <div className="input-group">
                            <label htmlFor="correo-actual">Correo actual</label>
                            <div className="input-icon-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    id="correo-actual"
                                    value={correoActual}
                                    onChange={(e) => setCorreoActual(e.target.value)}
                                    className="perfil-input"
                                    placeholder="Tu correo actual"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="correo-nuevo">Correo nuevo</label>
                            <div className="input-icon-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    id="correo-nuevo"
                                    value={correoNuevo}
                                    onChange={(e) => setCorreoNuevo(e.target.value)}
                                    className="perfil-input"
                                    placeholder="Nuevo correo"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input-icon-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="perfil-input"
                                    placeholder="Contraseña actual"
                                />
                            </div>
                        </div>

                        <div className="botones-formulario">
                            <button
                                type="button"
                                className="volver-btn"
                                onClick={() => navigate('/perfil')}
                            >
                                <FaArrowLeft style={{ marginRight: '8px' }} />
                                Volver
                            </button>

                            <button type="submit" className="guardar-btn">
                                Guardar cambios
                            </button>
                        </div>
                    </form>
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

export default CambiarCorreo;
