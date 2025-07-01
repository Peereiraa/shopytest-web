// Mismos imports (dejamos firebase solo para Google)
import React, { useState } from "react";
import { auth, provider } from "../components/firebase";
import { signInWithPopup, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import googleLogo from "../assets/google.png";
import "../styles/toast.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleRegister = async () => {
        if (loading) return;

        // Validaciones
        if (!username.trim() || !email.trim() || !password || !repeatPassword) {
            return toast.error("Por favor rellena todos los campos", { position: "bottom-right" });
        }
        if (username.length > 20) {
            return toast.error("El nombre de usuario no puede tener más de 20 caracteres", { position: "bottom-right" });
        }
        if (!isValidEmail(email)) {
            return toast.error("Correo electrónico inválido", { position: "bottom-right" });
        }
        if (password.length < 6) {
            return toast.error("La contraseña debe tener al menos 6 caracteres", { position: "bottom-right" });
        }
        if (password !== repeatPassword) {
            return toast.error("Las contraseñas no coinciden", { position: "bottom-right" });
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error en el registro");

            toast.success("Registro exitoso", { position: "bottom-right" });

            setUsername("");
            setEmail("");
            setPassword("");
            setRepeatPassword("");

            navigate("/?registered=true");
        } catch (error) {
            toast.error(error.message, { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await updateProfile(user, { displayName: user.displayName || "GoogleUser" });

            toast.success("Registro con Google exitoso", { position: "bottom-right" });
            navigate("/?registered=true");
        } catch (error) {
            toast.error("Error al registrarse con Google", { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-container">
                <img src="/logo-azul.png" alt="Logo" className="logo" />
                <h2>Registro</h2>

                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    maxLength={20}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <div style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingRight: "2.5rem" }}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={toggleStyle}
                        disabled={loading}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>
                <div style={{ position: "relative" }}>
                    <input
                        type={showRepeatPassword ? "text" : "password"}
                        placeholder="Repetir contraseña"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        style={{ paddingRight: "2.5rem" }}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        style={toggleStyle}
                        disabled={loading}
                    >
                        {showRepeatPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <button className="main-btn" onClick={handleRegister} disabled={loading}>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>

                <p className="register-text">
                    ¿Ya tienes cuenta?{" "}
                    <span className="register-link" onClick={() => navigate("/")}>
                        Iniciar sesión
                    </span>
                </p>

                <hr />

                <button className="google-btn" onClick={handleGoogleRegister} disabled={loading}>
                    <img src={googleLogo} alt="Google" />
                    {loading ? "Procesando..." : "Registrarse con Google"}
                </button>
            </div>

            <ToastContainer position="bottom-right" autoClose={4000} theme="colored" />
        </>
    );
}

const toggleStyle = {
    position: "absolute",
    right: "0.6rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "#190152",
};
