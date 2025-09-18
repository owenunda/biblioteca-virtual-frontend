/**
 * Hook personalizado para manejar la autenticación de usuarios
 * Proporciona funciones para login, logout y gestión del estado de autenticación
 */
"use client";
import { useState, useEffect, createContext, useContext } from "react";
const API_URL = "https://biblioteca-virtual-backend-production-25d1.up.railway.app";
// Crear el contexto de autenticación
const AuthContext = createContext(undefined);
// Proveedor del contexto de autenticación
export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Cargar usuario desde localStorage al inicializar
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        const tokenGuardado = localStorage.getItem("access_token");
        if (usuarioGuardado && tokenGuardado) {
            try {
                setUsuario(JSON.parse(usuarioGuardado));
            } catch (error) {
                console.error("Error al cargar usuario:", error);
                localStorage.removeItem("usuario");
                localStorage.removeItem("access_token");
            }
        }
        setIsLoading(false);
    }, []);
    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) return false;
            const data = await res.json();
            // Espera: { access_token, user: { name, email, role } }
            if (data && data.access_token && data.user) {
                // Guardar token y usuario por separado
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("usuario", JSON.stringify(data.user));
                setUsuario(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error en login:", error);
            return false;
        }
    };
    // Función para cerrar sesión
    const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("access_token");
    };
    // Función para registrar nuevo usuario
        const register = async (datos) => {
            try {
                console.log(datos);
                const res = await fetch(`${API_URL}/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos)
                });
                if (!res.ok) return null;
                const nuevoUsuario = await res.json();
                setUsuario(nuevoUsuario);
                localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
                return nuevoUsuario;
            } catch (error) {
                console.error("Error en registro:", error);
                return null;
            }
        };
    const value = {
        usuario,
        isLoading,
        login,
        logout,
        register,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
// Hook para usar el contexto de autenticación
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
}
