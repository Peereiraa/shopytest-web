import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../styles/Auth.css';
import { auth, provider } from "../components/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import googleLogo from "../assets/google.png";
import '../styles/components/toast.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const username = localStorage.getItem("username");

        if (username) {
            navigate("/home");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                localStorage.setItem("userEmail", user.email);
                localStorage.setItem("username", user.displayName);
                localStorage.setItem("userId", data.userId);
                navigate("/home");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("registered") === "true") {
            toast.success("Cuenta registrada correctamente", { position: "bottom-right" });


            params.delete("registered");
            const newSearch = params.toString();
            navigate({
                pathname: location.pathname,
                search: newSearch ? `?${newSearch}` : ""
            }, { replace: true });
        }
    }, [location, navigate]);

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
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userId", data.userId);

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

            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("username", user.displayName);

            toast.success("Inicio de sesión con Google exitoso", { position: "bottom-right" });
            navigate("/home");

        } catch (error) {
            toast.error("Error al iniciar sesión con Google", { position: "bottom-right" });
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <>
            <div className="auth-page">
                <div className="login-container">
                    <img src="../assets/logo.jpg" alt="Logo" className="logo" />
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ position: "relative", marginBottom: "1.2rem" }}>
                            <FaEnvelope
                                style={{
                                    position: "absolute",
                                    left: "0.6rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#999",
                                    fontSize: "1.2rem",
                                    pointerEvents: "none",
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                style={{ paddingLeft: "2.2rem", width: "100%" }}
                            />
                        </div>

                        <div style={{ position: "relative", marginBottom: "1.2rem" }}>
                            <FaLock
                                style={{
                                    position: "absolute",
                                    left: "0.6rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#999",
                                    fontSize: "1.2rem",
                                    pointerEvents: "none",
                                }}
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                style={{ paddingLeft: "2.2rem", width: "100%" }}
                            />
                        </div>

                        <button type="submit" className="main-btn" disabled={loading}>
                            {loading ? "Cargando..." : "Iniciar sesión"}
                        </button>
                    </form>

                    <p className="forgot-password">¿Olvidaste tu contraseña?</p>
                    <p className="register-text">
                        ¿No tienes cuenta?{" "}
                        <Link
                            to="/Register"
                            style={{
                                fontWeight: 600,
                                color: "#171F1D",
                                textDecoration: "none",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                        >
                            Regístrate
                        </Link>
                    </p>

                    <hr />

                    <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                        <img src={googleLogo} alt="Google" />
                        {loading ? "Cargando..." : "Iniciar sesión con Google"}
                    </button>
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

}
