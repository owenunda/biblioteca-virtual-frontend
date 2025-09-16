/**
 * Formulario de inicio de sesión
 * Permite a los usuarios autenticarse en el sistema
 */

"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen } from "lucide-react"

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [correo, setCorreo] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(correo, contraseña)
      if (!success) {
        setError("Correo o contraseña incorrectos")
      }
    } catch (error) {
      setError("Error al iniciar sesión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
        <CardDescription>Accede a tu cuenta de la biblioteca virtual</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu.correo@universidad.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contraseña">Contraseña</Label>
            <Input
              id="contraseña"
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" onClick={onToggleMode} className="text-sm">
              ¿No tienes cuenta? Regístrate aquí
            </Button>
          </div>
        </form>

        {/* Credenciales de prueba */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Credenciales de prueba:</p>
          <div className="text-xs space-y-1">
            <p>
              <strong>Estudiante:</strong> juan.perez@universidad.edu / hashed_password_123
            </p>
            <p>
              <strong>Docente:</strong> maria.garcia@universidad.edu / hashed_password_456
            </p>
            <p>
              <strong>Bibliotecario:</strong> carlos.lopez@universidad.edu / hashed_password_789
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
