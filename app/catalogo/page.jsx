/**
 * Página del catálogo de libros
 * Permite buscar, filtrar y explorar todos los libros disponibles
 */
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { LibroCard } from "@/components/catalogo/libro-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { db } from "@/lib/database";
import { Search, Filter, BookOpen } from "lucide-react";
export default function CatalogoPage() {
    const { usuario } = useAuth();
    const [libros, setLibros] = useState([]);
    const [librosFiltrados, setLibrosFiltrados] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState("all");
    const [estadoFiltro, setEstadoFiltro] = useState("all");
    const [categorias, setCategorias] = useState([]);
    // Cargar datos iniciales
  useEffect(() => {
    async function fetchLibros() {
      const API_URL = "https://biblioteca-virtual-backend-production-25d1.up.railway.app";
      const res = await fetch(`${API_URL}/books`);
      if (res.ok) {
        const data = await res.json();
        // Adaptar los datos a la estructura esperada por el frontend
        const adaptados = data.map(libro => ({
          id: libro.book_id,
          titulo: libro.title,
          categoria: libro.category,
          estado: libro.estado,
          autor: libro.autor || "Autor desconocido",
          editorial: libro.editorial || "",
          isbn: libro.isbn || "",
          fechaPublicacion: libro.fechaPublicacion || "",
          copias: libro.copias || 1,
          copiasDisponibles: libro.copiasDisponibles || 1
        }));
        setLibros(adaptados);
        setLibrosFiltrados(adaptados);
        // Extraer categorías únicas
        const categoriasUnicas = [...new Set(adaptados.map((libro) => libro.categoria))];
        setCategorias(categoriasUnicas);
      }
    }
    fetchLibros();
  }, []);
    // Aplicar filtros cuando cambien los criterios de búsqueda
  useEffect(() => {
    let resultado = libros;
    // Filtro por búsqueda de texto
    if (busqueda.trim()) {
      const terminoLower = busqueda.toLowerCase();
      resultado = resultado.filter((libro) =>
        libro.titulo.toLowerCase().includes(terminoLower) ||
        libro.autor.toLowerCase().includes(terminoLower) ||
        libro.categoria.toLowerCase().includes(terminoLower)
      );
    }
    // Filtro por categoría
    if (categoriaFiltro !== "all") {
      resultado = resultado.filter((libro) => libro.categoria === categoriaFiltro);
    }
    // Filtro por estado
    if (estadoFiltro !== "all") {
      resultado = resultado.filter((libro) => libro.estado === estadoFiltro);
    }
    setLibrosFiltrados(resultado);
  }, [busqueda, categoriaFiltro, estadoFiltro, libros]);
    // Limpiar filtros
    const limpiarFiltros = () => {
        setBusqueda("");
        setCategoriaFiltro("all");
        setEstadoFiltro("all");
    };
    // Actualizar lista después de acciones
  const handleUpdate = async () => {
    const API_URL = "https://biblioteca-virtual-backend-production-25d1.up.railway.app";
    const res = await fetch(`${API_URL}/books`);
    if (res.ok) {
      const data = await res.json();
      const adaptados = data.map(libro => ({
        id: libro.book_id,
        titulo: libro.title,
        categoria: libro.category,
        estado: libro.estado,
        autor: libro.autor || "Autor desconocido",
        editorial: libro.editorial || "",
        isbn: libro.isbn || "",
        fechaPublicacion: libro.fechaPublicacion || "",
        copias: libro.copias || 1,
        copiasDisponibles: libro.copiasDisponibles || 1
      }));
      setLibros(adaptados);
    }
  };
    // Redirigir si no está autenticado
    if (!usuario) {
        return (<div className="min-h-screen flex items-center justify-center">
        <p>Debes iniciar sesión para acceder al catálogo.</p>
      </div>);
    }
    return (<div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-primary"/>
            Catálogo de Libros
          </h1>
          <p className="text-muted-foreground">Explora nuestra colección de {libros.length} libros disponibles</p>
        </div>

        {/* Filtros y búsqueda */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2"/>
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda por texto */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Buscar por título, autor..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-10"/>
              </div>

              {/* Filtro por categoría */}
              <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (<SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>))}
                </SelectContent>
              </Select>

              {/* Filtro por estado */}
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="prestado">Prestado</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                </SelectContent>
              </Select>

              {/* Botón limpiar filtros */}
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Mostrando {librosFiltrados.length} de {libros.length} libros
          </p>
        </div>

        {/* Grid de libros */}
        {librosFiltrados.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {librosFiltrados.map((libro) => (<LibroCard key={libro.id} libro={libro} onUpdate={handleUpdate}/>))}
          </div>) : (<Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
              <h3 className="text-lg font-medium mb-2">No se encontraron libros</h3>
              <p className="text-muted-foreground mb-4">Intenta ajustar los filtros de búsqueda</p>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>)}
      </main>
    </div>);
}
