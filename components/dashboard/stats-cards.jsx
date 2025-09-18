/**
 * Componente de tarjetas de estadísticas para el dashboard
 * Muestra métricas importantes de la biblioteca
 */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, FileText, Clock } from "lucide-react";
export function StatsCards({ estadisticas }) {
    const stats = [
        {
            title: "Total de Libros",
            value: estadisticas.totalLibros,
            icon: BookOpen,
            description: `${estadisticas.librosDisponibles} disponibles`,
            color: "text-blue-600",
        },
        {
            title: "Usuarios Activos",
            value: estadisticas.totalUsuarios,
            icon: Users,
            description: "Registrados en el sistema",
            color: "text-green-600",
        },
        {
            title: "Préstamos Activos",
            value: estadisticas.prestamosActivos,
            icon: FileText,
            description: "Libros prestados actualmente",
            color: "text-orange-600",
        },
        {
            title: "Reservas Pendientes",
            value: estadisticas.reservasActivas,
            icon: Clock,
            description: "Esperando disponibilidad",
            color: "text-purple-600",
        },
    ];
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (<Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`}/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>);
        })}
    </div>);
}
