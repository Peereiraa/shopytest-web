import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import CambiarCorreo from './pages/Profile/CambiarCorreo';
import CambiarContraseña from './pages/Profile/CambiarContraseña';
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./components/auth";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección raíz */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Registro */}
        <Route path="/register" element={<Register />} />

        {/* Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Perfil */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* Cambiar Correo */}
        <Route
          path="/cambiar-correo"
          element={
            <ProtectedRoute>
              <CambiarCorreo />
            </ProtectedRoute>
          }
        />
        {/* Cambiar Contraseña */}
        <Route
          path="/cambiar-contraseña"
          element={
            <ProtectedRoute>
              <CambiarContraseña />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
