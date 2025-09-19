/**
 * Página de gestión de usuarios
 * Muestra la lista de usuarios registrados en el sistema
 */
"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuarios() {
      setIsLoading(true);
      const API_URL = "https://biblioteca-virtual-backend-production-25d1.up.railway.app";
      const res = await fetch(`${API_URL}/users`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
      setIsLoading(false);
    }
    fetchUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Gestión de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando usuarios...</div>
            ) : (
              <ul className="divide-y divide-muted">
                {usuarios.map((usuario) => (
                  <li key={usuario.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                    <span className="font-medium text-foreground">{usuario.nombre || usuario.name}</span>
                    <span className="text-xs text-muted-foreground mt-1 md:mt-0">{usuario.email}</span>
                    <span className="text-xs text-muted-foreground mt-1 md:mt-0">{usuario.role || usuario.tipo}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
