import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, provider } from "../components/firebase";
import { signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import googleLogo from "../assets/google.png";
import '../styles/toast.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("registered") === "true") {
            toast.success("Cuenta registrada correctamente", {
                position: "bottom-right",
                autoClose: 4000,
            });
        }
    }, [location]);

    const handleLogin = async () => {
        if (loading) return;
        if (!email.trim() || !password) {
            toast.error("Por favor rellena todos los campos", { position: "bottom-right" });
            return;
        }
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Correo o contraseña incorrectos", { position: "bottom-right" });
                setLoading(false);
                return;
            }

            toast.success(data.message || "Inicio de sesión exitoso", { position: "bottom-right" });

            setEmail("");
            setPassword("");

            localStorage.setItem("username", data.username);

            navigate("/home");

        } catch (error) {
            toast.error("Error de conexión con el servidor", { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            toast.success("Inicio de sesión con Google exitoso", { position: "bottom-right" });
            navigate("/home");

        } catch (error) {
            toast.error("Error al iniciar sesión con Google", { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-container">
                <img src="/logo-azul.png" alt="Logo" className="logo" />
                <h2>Iniciar Sesión</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <button className="main-btn" onClick={handleLogin} disabled={loading}>
                    {loading ? "Cargando..." : "Iniciar sesión"}
                </button>

                <p className="forgot-password">¿Olvidaste tu contraseña?</p>
                <p className="register-text">
                    ¿No tienes cuenta?{" "}
                    <Link to="/Register" className="register-link">Regístrate</Link>
                </p>

                <hr />

                <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                    <img src={googleLogo} alt="Google" />
                    {loading ? "Cargando..." : "Iniciar sesión con Google"}
                </button>
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
}
