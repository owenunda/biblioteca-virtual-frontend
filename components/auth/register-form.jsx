/**
 * Formulario de registro de usuarios
 * Permite crear nuevas cuentas en el sistema
 */
"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";
export function RegisterForm({ onToggleMode }) {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        contraseña: "",
        confirmarContraseña: "",
        tipo: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        // Validaciones
        if (formData.contraseña !== formData.confirmarContraseña) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (formData.contraseña.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        if (!formData.tipo) {
            setError("Selecciona un tipo de usuario");
            return;
        }
        setIsLoading(true);
        try {
            const nuevoUsuario = await register({
                nombre: formData.nombre,
                correo: formData.correo,
                contraseña: formData.contraseña,
                tipo: formData.tipo,
                fechaRegistro: new Date().toISOString().split("T")[0],
                activo: true,
            });
            if (!nuevoUsuario) {
                setError("El correo electrónico ya está registrado");
            }
        }
        catch (error) {
            setError("Error al registrar usuario. Intenta nuevamente.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [field]: value })));
    };
    return (<Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <BookOpen className="h-12 w-12 text-primary"/>
        </div>
        <CardTitle className="text-2xl font-bold">Registro</CardTitle>
        <CardDescription>Crea tu cuenta en la biblioteca virtual</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input id="nombre" type="text" value={formData.nombre} onChange={(e) => handleInputChange("nombre", e.target.value)} placeholder="Tu nombre completo" required/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo Electrónico</Label>
            <Input id="correo" type="email" value={formData.correo} onChange={(e) => handleInputChange("correo", e.target.value)} placeholder="tu.correo@universidad.edu" required/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Usuario</Label>
            <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu tipo de usuario"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="docente">Docente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contraseña">Contraseña</Label>
            <Input id="contraseña" type="password" value={formData.contraseña} onChange={(e) => handleInputChange("contraseña", e.target.value)} placeholder="••••••••" required/>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmarContraseña">Confirmar Contraseña</Label>
            <Input id="confirmarContraseña" type="password" value={formData.confirmarContraseña} onChange={(e) => handleInputChange("confirmarContraseña", e.target.value)} placeholder="••••••••" required/>
          </div>

          {error && (<Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>)}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" onClick={onToggleMode} className="text-sm">
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);
}
