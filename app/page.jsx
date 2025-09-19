/**
 * Página principal del sistema de biblioteca
 * Muestra el dashboard con estadísticas y acceso rápido a funciones principales
 */
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Navbar } from "@/components/layout/navbar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { db } from "@/lib/database";
import Link from "next/link";
import { BookOpen, FileText, Users, BarChart3 } from "lucide-react";
export default function HomePage() {
    const { usuario, isLoading } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [estadisticas, setEstadisticas] = useState(null);
    // Cargar estadísticas cuando el usuario esté autenticado
  useEffect(() => {
    async function fetchStats() {
      if (!usuario) return;
      const API_URL = "https://biblioteca-virtual-backend-production-25d1.up.railway.app";
      const res = await fetch(`${API_URL}/stats`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (res.ok) {
        const stats = await res.json();
        setEstadisticas(stats);
      }
    }
    fetchStats();
  }, [usuario]);
    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse"/>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>);
    }
    // Si no hay usuario autenticado, mostrar formularios de login/registro
    if (!usuario) {
        return (<div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        {isLoginMode ? (<LoginForm onToggleMode={() => setIsLoginMode(false)}/>) : (<RegisterForm onToggleMode={() => setIsLoginMode(true)}/>)}
      </div>);
    }
    // Dashboard principal para usuarios autenticados
    return (<div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado de bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido, {usuario.nombre}</h1>
          <p className="text-muted-foreground">
            {usuario.tipo === "bibliotecario"
            ? "Panel de administración de la biblioteca"
            : "Explora y gestiona tus préstamos de libros"}
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        {estadisticas && (<div className="mb-8">
            <StatsCards estadisticas={estadisticas}/>
          </div>)}

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Catálogo de libros */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary"/>
                Catálogo de Libros
              </CardTitle>
              <CardDescription>Explora y busca libros disponibles en la biblioteca</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/catalogo">
                <Button className="w-full">Ver Catálogo</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mis préstamos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary"/>
                Mis Préstamos
              </CardTitle>
              <CardDescription>Gestiona tus préstamos y devoluciones</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/prestamos">
                <Button className="w-full">Ver Préstamos</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gestión de usuarios (solo bibliotecarios) */}
          {usuario.tipo === "bibliotecario" && (<Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary"/>
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription>Administra usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/usuarios">
                  <Button className="w-full">Gestionar Usuarios</Button>
                </Link>
              </CardContent>
            </Card>)}

          {/* Reportes (solo bibliotecarios) */}
          {usuario.tipo === "bibliotecario" && (<Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary"/>
                  Reportes
                </CardTitle>
                <CardDescription>Visualiza estadísticas y reportes</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/reportes">
                  <Button className="w-full">Ver Reportes</Button>
                </Link>
              </CardContent>
            </Card>)}
        </div>

        {/* Información adicional para nuevos usuarios */}
        {usuario.tipo !== "bibliotecario" && (<Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle>¿Cómo usar la biblioteca virtual?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">1. Explora el catálogo</h4>
                  <p className="text-muted-foreground">
                    Busca libros por título, autor o categoría en nuestro catálogo completo.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Reserva libros</h4>
                  <p className="text-muted-foreground">Reserva libros disponibles o únete a la lista de espera.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Gestiona préstamos</h4>
                  <p className="text-muted-foreground">Revisa tus préstamos activos y fechas de devolución.</p>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </main>
    </div>);
}
