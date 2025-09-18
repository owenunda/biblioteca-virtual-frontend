/**
 * Componente de navegación principal
 * Muestra el menú de navegación y opciones de usuario
 */
"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, Users, FileText, BarChart3, User, LogOut } from "lucide-react";
export function Navbar() {
    const { usuario, logout } = useAuth();
    return (<nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 mr-3"/>
            <Link href="/" className="text-xl font-bold">
              Biblioteca Virtual
            </Link>
          </div>

          {/* Menú de navegación */}
          {usuario && (<div className="flex items-center space-x-4">
              <Link href="/catalogo" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors">
                <BookOpen className="h-4 w-4 mr-2"/>
                Catálogo
              </Link>

              <Link href="/prestamos" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors">
                <FileText className="h-4 w-4 mr-2"/>
                Préstamos
              </Link>

              {/* Menú solo para bibliotecarios */}
              {usuario.tipo === "bibliotecario" && (<>
                  <Link href="/usuarios" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors">
                    <Users className="h-4 w-4 mr-2"/>
                    Usuarios
                  </Link>

                  <Link href="/reportes" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/80 transition-colors">
                    <BarChart3 className="h-4 w-4 mr-2"/>
                    Reportes
                  </Link>
                </>)}

              {/* Menú de usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80">
                    <User className="h-4 w-4 mr-2"/>
                    {usuario.nombre}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2"/>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>)}
        </div>
      </div>
    </nav>);
}
