/**
 * Componente de tarjeta para mostrar información de un libro
 * Incluye opciones para reservar o prestar según disponibilidad
 */
"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Calendar, User } from "lucide-react";
export function LibroCard({ libro, onUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const { usuario } = useAuth();
    const { toast } = useToast();
    // Determinar el color del badge según el estado
    const getEstadoBadgeVariant = (estado) => {
        switch (estado) {
            case "disponible":
                return "default";
            case "prestado":
                return "destructive";
            case "reservado":
                return "secondary";
            default:
                return "outline";
        }
    };
    // Manejar reserva de libro
    const handleReservar = async () => {
        if (!usuario)
            return;
        setIsLoading(true);
        try {
            const fechaActual = new Date();
            const fechaExpiracion = new Date();
            fechaExpiracion.setDate(fechaActual.getDate() + 7); // Reserva por 7 días
            db.crearReserva({
                usuarioId: usuario.id,
                libroId: libro.id,
                fechaReserva: fechaActual.toISOString().split("T")[0],
                fechaExpiracion: fechaExpiracion.toISOString().split("T")[0],
                estado: "activa",
            });
            toast({
                title: "Reserva exitosa",
                description: `Has reservado "${libro.titulo}" por 7 días.`,
            });
            onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate();
        }
        catch (error) {
            toast({
                title: "Error",
                description: "No se pudo realizar la reserva.",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    // Manejar préstamo de libro (solo para bibliotecarios)
    const handlePrestar = async () => {
        if (!usuario || usuario.tipo !== "bibliotecario")
            return;
        setIsLoading(true);
        try {
            const fechaInicio = new Date();
            const fechaFin = new Date();
            fechaFin.setDate(fechaInicio.getDate() + 14); // Préstamo por 14 días
            db.crearPrestamo({
                usuarioId: usuario.id,
                libroId: libro.id,
                fechaInicio: fechaInicio.toISOString().split("T")[0],
                fechaFin: fechaFin.toISOString().split("T")[0],
                fechaDevolucion: null,
                estado: "activo",
                renovaciones: 0,
                multa: 0,
            });
            toast({
                title: "Préstamo registrado",
                description: `Préstamo de "${libro.titulo}" registrado exitosamente.`,
            });
            onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate();
        }
        catch (error) {
            toast({
                title: "Error",
                description: "No se pudo registrar el préstamo.",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{libro.titulo}</CardTitle>
            <CardDescription className="flex items-center mt-2">
              <User className="h-4 w-4 mr-1"/>
              {libro.autor}
            </CardDescription>
          </div>
          <Badge variant={getEstadoBadgeVariant(libro.estado)}>{libro.estado}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-2"/>
            <span>{libro.categoria}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2"/>
            <span>Publicado: {libro.fechaPublicacion}</span>
          </div>

          <div className="text-sm">
            <span className="font-medium">Editorial:</span> {libro.editorial}
          </div>

          <div className="text-sm">
            <span className="font-medium">ISBN:</span> {libro.isbn}
          </div>

          <div className="text-sm">
            <span className="font-medium">Disponibles:</span> {libro.copiasDisponibles} de {libro.copias}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            {libro.copiasDisponibles > 0 && (usuario === null || usuario === void 0 ? void 0 : usuario.tipo) === "bibliotecario" && (<Button onClick={handlePrestar} disabled={isLoading} size="sm" className="flex-1">
                {isLoading ? "Prestando..." : "Prestar"}
              </Button>)}

            {libro.copiasDisponibles === 0 && (usuario === null || usuario === void 0 ? void 0 : usuario.tipo) !== "bibliotecario" && (<Button onClick={handleReservar} disabled={isLoading} variant="outline" size="sm" className="flex-1 bg-transparent">
                {isLoading ? "Reservando..." : "Reservar"}
              </Button>)}

            {libro.copiasDisponibles > 0 && (usuario === null || usuario === void 0 ? void 0 : usuario.tipo) !== "bibliotecario" && (<Button onClick={handleReservar} disabled={isLoading} size="sm" className="flex-1">
                {isLoading ? "Reservando..." : "Reservar"}
              </Button>)}
          </div>
        </div>
      </CardContent>
    </Card>);
}
