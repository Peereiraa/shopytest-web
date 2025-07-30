import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Perfil.css';
import Nav from '../../components/Nav';
import { toast, ToastContainer } from "react-toastify";
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

const CambiarContraseña = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [passwordActual, setPasswordActual] = useState("");
    const [passwordNuevo, setPasswordNuevo] = useState("");
    const [confirmPasswordNuevo, setConfirmPasswordNuevo] = useState("");

    // Estados para mostrar/ocultar passwords
    const [showPasswordActual, setShowPasswordActual] = useState(false);
    const [showPasswordNuevo, setShowPasswordNuevo] = useState(false);
    const [showConfirmPasswordNuevo, setShowConfirmPasswordNuevo] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordActual || !passwordNuevo || !confirmPasswordNuevo) {
            toast.error("Todos los campos son obligatorios", { position: "bottom-right" });
            return;
        }

        if (passwordNuevo !== confirmPasswordNuevo) {
            toast.error("Las nuevas contraseñas no coinciden", { position: "bottom-right" });
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/users/${userId}/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordActual,
                    newPassword: passwordNuevo,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al cambiar la contraseña");
            }

            navigate("/perfil", { state: { passwordChanged: true } });

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
                        <h2 className="perfil-username">Cambiar contraseña</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="form-cambiar-correo">

                        <div className="input-group">
                            <label htmlFor="password-actual">Contraseña actual</label>
                            <div className="input-icon-wrapper" style={{ position: "relative" }}>
                                <FaLock className="input-icon" />
                                <input
                                    type={showPasswordActual ? "text" : "password"}
                                    id="password-actual"
                                    value={passwordActual}
                                    onChange={(e) => setPasswordActual(e.target.value)}
                                    className="perfil-input"
                                    placeholder="Contraseña actual"
                                />
                                <span
                                    onClick={() => setShowPasswordActual(!showPasswordActual)}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-45%)",
                                        cursor: "pointer",
                                        color: "#ccc",
                                        fontSize: "1.2rem",
                                    }}
                                    aria-label={showPasswordActual ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPasswordActual ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password-nuevo">Nueva contraseña</label>
                            <div className="input-icon-wrapper" style={{ position: "relative" }}>
                                <FaLock className="input-icon" />
                                <input
                                    type={showPasswordNuevo ? "text" : "password"}
                                    id="password-nuevo"
                                    value={passwordNuevo}
                                    onChange={(e) => setPasswordNuevo(e.target.value)}
                                    className="perfil-input"
                                    placeholder="Nueva contraseña"
                                />
                                <span
                                    onClick={() => setShowPasswordNuevo(!showPasswordNuevo)}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-45%)",
                                        cursor: "pointer",
                                        color: "#ccc",
                                        fontSize: "1.2rem",
                                    }}
                                    aria-label={showPasswordNuevo ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPasswordNuevo ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirm-password-nuevo">Confirmar nueva contraseña</label>
                            <div className="input-icon-wrapper" style={{ position: "relative" }}>
                                <FaLock className="input-icon" />
                                <input
                                    type={showConfirmPasswordNuevo ? "text" : "password"}
                                    id="confirm-password-nuevo"
                                    value={confirmPasswordNuevo}
                                    onChange={(e) => setConfirmPasswordNuevo(e.target.value)}
                                    className="perfil-input"
                                    placeholder="Confirmar nueva contraseña"
                                />
                                <span
                                    onClick={() => setShowConfirmPasswordNuevo(!showConfirmPasswordNuevo)}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-45%)",
                                        cursor: "pointer",
                                        color: "#ccc",
                                        fontSize: "1.2rem",
                                    }}
                                    aria-label={showConfirmPasswordNuevo ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showConfirmPasswordNuevo ? <FaEyeSlash /> : <FaEye />}
                                </span>
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

export default CambiarContraseña;
