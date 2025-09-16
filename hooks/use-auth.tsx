/**
 * Hook personalizado para manejar la autenticación de usuarios
 * Proporciona funciones para login, logout y gestión del estado de autenticación
 */

"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { Usuario } from "@/types"
import { db } from "@/lib/database"

// Interfaz para el contexto de autenticación
interface AuthContextType {
  usuario: Usuario | null
  isLoading: boolean
  login: (correo: string, contraseña: string) => Promise<boolean>
  logout: () => void
  register: (datos: Omit<Usuario, "id">) => Promise<Usuario | null>
}

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado))
      } catch (error) {
        console.error("Error al cargar usuario:", error)
        localStorage.removeItem("usuario")
      }
    }
    setIsLoading(false)
  }, [])

  // Función para iniciar sesión
  const login = async (correo: string, contraseña: string): Promise<boolean> => {
    try {
      const usuarioAutenticado = db.autenticarUsuario(correo, contraseña)
      if (usuarioAutenticado) {
        setUsuario(usuarioAutenticado)
        localStorage.setItem("usuario", JSON.stringify(usuarioAutenticado))
        return true
      }
      return false
    } catch (error) {
      console.error("Error en login:", error)
      return false
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
  }

  // Función para registrar nuevo usuario
  const register = async (datos: Omit<Usuario, "id">): Promise<Usuario | null> => {
    try {
      // Verificar si el correo ya existe
      const usuarioExistente = db.getUsuarioPorCorreo(datos.correo)
      if (usuarioExistente) {
        return null // Usuario ya existe
      }

      const nuevoUsuario = db.registrarUsuario(datos)
      setUsuario(nuevoUsuario)
      localStorage.setItem("usuario", JSON.stringify(nuevoUsuario))
      return nuevoUsuario
    } catch (error) {
      console.error("Error en registro:", error)
      return null
    }
  }

  const value = {
    usuario,
    isLoading,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
