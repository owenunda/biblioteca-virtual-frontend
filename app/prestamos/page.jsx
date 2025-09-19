/**
 * Página de gestión de préstamos
 * Muestra préstamos activos y permite gestionar devoluciones
 */
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { db } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar, User, BookOpen, RotateCcw } from "lucide-react";
export default function PrestamosPage() {
  const { usuario } = useAuth();
  const { toast } = useToast();
  const [prestamos, setPrestamos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Cargar préstamos
  useEffect(() => {
    async function fetchPrestamos() {
      if (!usuario) return;
      const API_URL = "https://biblioteca-virtual-backend-production-25d1.up.railway.app";
      let url = `${API_URL}/prestamos`;
      if (usuario.role !== "BIBLIOTECARIO") {
        url += `?user_id=${usuario.id}`;
      }
      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Adaptar los datos recibidos del backend
        const adaptados = data.map(prestamo => ({
          id: prestamo.prestamo_id || prestamo.id,
          estado: prestamo.estado,
          fechaInicio: prestamo.fechaInicio || prestamo.fecha_inicio || "",
          fechaFin: prestamo.fechaFin || prestamo.fecha_fin || "",
          fechaDevolucion: prestamo.fechaDevolucion || prestamo.fecha_devolucion || "",
          libro: {
            titulo: prestamo.titulo || prestamo.libro?.titulo || prestamo.libro?.title || prestamo.title || "",
            categoria: prestamo.categoria || prestamo.libro?.categoria || prestamo.libro?.category || prestamo.category || "",
          },
          usuario: {
            nombre: prestamo.nombre || prestamo.usuario?.nombre || prestamo.usuario?.name || prestamo.name || ""
          }
        }));
        setPrestamos(adaptados);
      }
    }
    fetchPrestamos();
  }, [usuario]);
  // Manejar devolución de libro
  const handleDevolucion = async (prestamoId) => {
    setIsLoading(true);
    const API_URL = "https://biblioteca-virtual-backend-production-25d1.up.railway.app";
    try {
      const res = await fetch(`${API_URL}/prestamos/devolver/${prestamoId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        toast({
          title: "Devolución exitosa",
          description: "El libro ha sido devuelto correctamente.",
        });
        // Recargar préstamos
        // Vuelve a consultar los préstamos
        if (usuario) {
          let url = `${API_URL}/prestamos`;
          if (usuario.role !== "BIBLIOTECARIO") {
            url += `?user_id=${usuario.id}`;
          }
          const res2 = await fetch(url, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem('access_token')}`
            }
          });
          if (res2.ok) {
            const data = await res2.json();
            setPrestamos(data);
          }
        }
      } else {
        toast({
          title: "Error",
          description: "No se pudo procesar la devolución.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la devolución.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Calcular días restantes
  const calcularDiasRestantes = (fechaFin) => {
    const hoy = new Date();
    const fechaVencimiento = new Date(fechaFin);
    const diferencia = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diferencia;
  };
  // Obtener color del badge según días restantes
  const getBadgeVariant = (diasRestantes) => {
    if (diasRestantes < 0)
      return "destructive";
    if (diasRestantes <= 3)
      return "secondary";
    return "default";
  };
  // Filtrar préstamos activos
  const prestamosActivos = prestamos.filter((p) => p.estado === "activo");
  const prestamosHistorial = prestamos.filter((p) => p.estado === "devuelto");
  if (!usuario) {
    return (<div className="min-h-screen flex items-center justify-center">
      <p>Debes iniciar sesión para ver los préstamos.</p>
    </div>);
  }
  return (<div className="min-h-screen bg-background">
    <Navbar />

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
          <FileText className="h-8 w-8 mr-3 text-primary" />
          {usuario.tipo === "bibliotecario" ? "Gestión de Préstamos" : "Mis Préstamos"}
        </h1>
        <p className="text-muted-foreground">
          {usuario.tipo === "bibliotecario"
            ? "Administra todos los préstamos del sistema"
            : "Revisa tus préstamos activos y historial"}
        </p>
      </div>

      {/* Préstamos activos */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Préstamos Activos ({prestamosActivos.length})
          </CardTitle>
          <CardDescription>Libros actualmente prestados</CardDescription>
        </CardHeader>
        <CardContent>
          {prestamosActivos.length > 0 ? (<div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libro</TableHead>
                  {usuario.role === "BIBLIOTECARIO" && <TableHead>Usuario</TableHead>}
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prestamosActivos.map((prestamo) => {
                  const diasRestantes = calcularDiasRestantes(prestamo.fechaFin);
                  return (
                    <TableRow key={prestamo.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{prestamo.libro?.titulo || prestamo.titulo || ""}</p>
                          <p className="text-sm text-muted-foreground">{prestamo.libro?.categoria || prestamo.categoria || ""}</p>
                        </div>
                      </TableCell>
                      {usuario.role === "BIBLIOTECARIO" && (
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {prestamo.usuario?.nombre || prestamo.nombre || ""}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {prestamo.fechaInicio}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {prestamo.fechaFin}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(diasRestantes)}>
                          {diasRestantes < 0
                            ? `Vencido (${Math.abs(diasRestantes)} días)`
                            : diasRestantes === 0
                              ? "Vence hoy"
                              : `${diasRestantes} días restantes`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleDevolucion(prestamo.id)} disabled={isLoading} className="flex items-center">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          {isLoading ? "Procesando..." : "Devolver"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>) : (<div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay préstamos activos</h3>
            <p className="text-muted-foreground">
              {usuario.tipo === "bibliotecario"
                ? "No hay libros prestados actualmente"
                : "No tienes libros prestados en este momento"}
            </p>
          </div>)}
        </CardContent>
      </Card>

      {/* Historial de préstamos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Historial de Préstamos ({prestamosHistorial.length})
          </CardTitle>
          <CardDescription>Libros devueltos anteriormente</CardDescription>
        </CardHeader>
        <CardContent>
          {prestamosHistorial.length > 0 ? (<div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Libro</TableHead>
                  {usuario.tipo === "bibliotecario" && <TableHead>Usuario</TableHead>}
                  <TableHead>Fecha Préstamo</TableHead>
                  <TableHead>Fecha Devolución</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prestamosHistorial.slice(0, 10).map((prestamo) => {
                  return (
                    <TableRow key={prestamo.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{prestamo.libro.titulo}</p>
                          <p className="text-sm text-muted-foreground">{prestamo.libro.categoria}</p>
                        </div>
                      </TableCell>
                      {usuario.role === "BIBLIOTECARIO" && (
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {prestamo.usuario.nombre}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{prestamo.fechaInicio}</TableCell>
                      <TableCell>{prestamo.fechaDevolucion}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Devuelto</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>) : (<div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin historial</h3>
            <p className="text-muted-foreground">No hay préstamos devueltos para mostrar</p>
          </div>)}
        </CardContent>
      </Card>
    </main>
  </div>);
}
