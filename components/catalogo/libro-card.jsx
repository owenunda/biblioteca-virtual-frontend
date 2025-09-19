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
// import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Calendar, User } from "lucide-react";


export function LibroCard({ libro, onUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const { usuario } = useAuth();
    const { toast } = useToast();
    // Determinar el color del badge según el estado
    const getEstadoBadgeVariant = (estado) => {
    switch (estado?.toLowerCase()) {
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
  const API_URL = "https://biblioteca-virtual-backend-production-25d1.up.railway.app";
  const handleReservar = async () => {
    if (!usuario) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/prestamos/reservar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ user_id: usuario.id, book_id: libro.id })
      });
      if (!res.ok) throw new Error("No se pudo reservar");
      toast({
        title: "Reserva exitosa",
        description: `Has reservado "${libro.titulo}" por 7 días.`,
      });
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo realizar la reserva.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Manejar préstamo de libro (solo para bibliotecarios)
  const handlePrestar = async () => {
    if (!usuario || usuario.role !== "BIBLIOTECARIO") return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/prestamos/prestar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ user_id: usuario.id, book_id: libro.id })
      });
      if (!res.ok) throw new Error("No se pudo prestar");
      toast({
        title: "Préstamo registrado",
        description: `Préstamo de "${libro.titulo}" registrado exitosamente.`,
      });
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el préstamo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{libro.titulo}</CardTitle>
              <CardDescription className="flex items-center mt-2">
                <BookOpen className="h-4 w-4 mr-1" />
                {libro.categoria}
              </CardDescription>
            </div>
            <Badge variant={getEstadoBadgeVariant(libro.estado)}>{libro.estado}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            {/* Préstamo solo para bibliotecario y si el libro está reservado o hay copias disponibles */}
            {(usuario?.role === "BIBLIOTECARIO" && (libro.estado?.toLowerCase() === "reservado" || libro.copiasDisponibles > 0)) && (
              <Button onClick={handlePrestar} disabled={isLoading} size="sm" className="flex-1">
                {isLoading ? "Prestando..." : "Prestar"}
              </Button>
            )}
            {/* Reservar si no es bibliotecario y hay copias disponibles */}
            {libro.copiasDisponibles > 0 && usuario && usuario.role !== "BIBLIOTECARIO" && (
              <Button onClick={handleReservar} disabled={isLoading} size="sm" className="flex-1">
                {isLoading ? "Reservando..." : "Reservar"}
              </Button>
            )}
            {/* Reservar si no es bibliotecario y no hay copias disponibles */}
            {libro.copiasDisponibles === 0 && usuario && usuario.role !== "BIBLIOTECARIO" && (
              <Button onClick={handleReservar} disabled={isLoading} variant="outline" size="sm" className="flex-1 bg-transparent">
                {isLoading ? "Reservando..." : "Reservar"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
}
