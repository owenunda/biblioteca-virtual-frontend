/**
 * Simulador de base de datos usando archivos JSON
 * Este módulo maneja todas las operaciones CRUD para el sistema de biblioteca
 */

import type { Usuario, Libro, Prestamo, Reserva, PrestamoExtendido, ReservaExtendida } from "@/types"

// Importar datos JSON (simulando una base de datos)
import usuariosData from "@/db/usuarios.json"
import librosData from "@/db/libros.json"
import prestamosData from "@/db/prestamos.json"
import reservasData from "@/db/reservas.json"

// Clase para manejar operaciones de base de datos
export class DatabaseService {
  private usuarios: Usuario[] = usuariosData.usuarios
  private libros: Libro[] = librosData.libros
  private prestamos: Prestamo[] = prestamosData.prestamos
  private reservas: Reserva[] = reservasData.reservas

  // ========== OPERACIONES DE USUARIOS ==========

  /**
   * Obtiene todos los usuarios
   */
  getUsuarios(): Usuario[] {
    return this.usuarios
  }

  /**
   * Busca un usuario por ID
   */
  getUsuarioPorId(id: string): Usuario | undefined {
    return this.usuarios.find((usuario) => usuario.id === id)
  }

  /**
   * Busca un usuario por correo electrónico
   */
  getUsuarioPorCorreo(correo: string): Usuario | undefined {
    return this.usuarios.find((usuario) => usuario.correo === correo)
  }

  /**
   * Autentica un usuario con correo y contraseña
   */
  autenticarUsuario(correo: string, contraseña: string): Usuario | null {
    const usuario = this.getUsuarioPorCorreo(correo)
    if (usuario && usuario.contraseña === contraseña && usuario.activo) {
      return usuario
    }
    return null
  }

  /**
   * Registra un nuevo usuario
   */
  registrarUsuario(usuario: Omit<Usuario, "id">): Usuario {
    const nuevoId = (Math.max(...this.usuarios.map((u) => Number.parseInt(u.id))) + 1).toString()
    const nuevoUsuario: Usuario = {
      ...usuario,
      id: nuevoId,
    }
    this.usuarios.push(nuevoUsuario)
    return nuevoUsuario
  }

  // ========== OPERACIONES DE LIBROS ==========

  /**
   * Obtiene todos los libros
   */
  getLibros(): Libro[] {
    return this.libros
  }

  /**
   * Busca un libro por ID
   */
  getLibroPorId(id: string): Libro | undefined {
    return this.libros.find((libro) => libro.id === id)
  }

  /**
   * Busca libros por título, autor o categoría
   */
  buscarLibros(termino: string): Libro[] {
    const terminoLower = termino.toLowerCase()
    return this.libros.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(terminoLower) ||
        libro.autor.toLowerCase().includes(terminoLower) ||
        libro.categoria.toLowerCase().includes(terminoLower),
    )
  }

  /**
   * Filtra libros por categoría
   */
  getLibrosPorCategoria(categoria: string): Libro[] {
    return this.libros.filter((libro) => libro.categoria === categoria)
  }

  /**
   * Obtiene todas las categorías únicas
   */
  getCategorias(): string[] {
    return [...new Set(this.libros.map((libro) => libro.categoria))]
  }

  // ========== OPERACIONES DE PRÉSTAMOS ==========

  /**
   * Obtiene todos los préstamos
   */
  getPrestamos(): Prestamo[] {
    return this.prestamos
  }

  /**
   * Obtiene préstamos con información extendida (usuario y libro)
   */
  getPrestamosExtendidos(): PrestamoExtendido[] {
    return this.prestamos.map((prestamo) => ({
      ...prestamo,
      usuario: this.getUsuarioPorId(prestamo.usuarioId),
      libro: this.getLibroPorId(prestamo.libroId),
    }))
  }

  /**
   * Obtiene préstamos activos
   */
  getPrestamosActivos(): PrestamoExtendido[] {
    return this.getPrestamosExtendidos().filter((prestamo) => prestamo.estado === "activo")
  }

  /**
   * Obtiene préstamos de un usuario específico
   */
  getPrestamosPorUsuario(usuarioId: string): PrestamoExtendido[] {
    return this.getPrestamosExtendidos().filter((prestamo) => prestamo.usuarioId === usuarioId)
  }

  /**
   * Crea un nuevo préstamo
   */
  crearPrestamo(prestamo: Omit<Prestamo, "id">): Prestamo {
    const nuevoId = (Math.max(...this.prestamos.map((p) => Number.parseInt(p.id))) + 1).toString()
    const nuevoPrestamo: Prestamo = {
      ...prestamo,
      id: nuevoId,
    }
    this.prestamos.push(nuevoPrestamo)

    // Actualizar disponibilidad del libro
    const libro = this.getLibroPorId(prestamo.libroId)
    if (libro && libro.copiasDisponibles > 0) {
      libro.copiasDisponibles--
      if (libro.copiasDisponibles === 0) {
        libro.estado = "prestado"
      }
    }

    return nuevoPrestamo
  }

  /**
   * Devuelve un libro (marca el préstamo como devuelto)
   */
  devolverLibro(prestamoId: string): boolean {
    const prestamo = this.prestamos.find((p) => p.id === prestamoId)
    if (prestamo && prestamo.estado === "activo") {
      prestamo.estado = "devuelto"
      prestamo.fechaDevolucion = new Date().toISOString().split("T")[0]

      // Actualizar disponibilidad del libro
      const libro = this.getLibroPorId(prestamo.libroId)
      if (libro) {
        libro.copiasDisponibles++
        if (libro.copiasDisponibles > 0 && libro.estado === "prestado") {
          libro.estado = "disponible"
        }
      }

      return true
    }
    return false
  }

  // ========== OPERACIONES DE RESERVAS ==========

  /**
   * Obtiene todas las reservas
   */
  getReservas(): Reserva[] {
    return this.reservas
  }

  /**
   * Obtiene reservas con información extendida
   */
  getReservasExtendidas(): ReservaExtendida[] {
    return this.reservas.map((reserva) => ({
      ...reserva,
      usuario: this.getUsuarioPorId(reserva.usuarioId),
      libro: this.getLibroPorId(reserva.libroId),
    }))
  }

  /**
   * Obtiene reservas activas
   */
  getReservasActivas(): ReservaExtendida[] {
    return this.getReservasExtendidas().filter((reserva) => reserva.estado === "activa")
  }

  /**
   * Crea una nueva reserva
   */
  crearReserva(reserva: Omit<Reserva, "id">): Reserva {
    const nuevoId = (Math.max(...this.reservas.map((r) => Number.parseInt(r.id))) + 1).toString()
    const nuevaReserva: Reserva = {
      ...reserva,
      id: nuevoId,
    }
    this.reservas.push(nuevaReserva)

    // Actualizar estado del libro si es necesario
    const libro = this.getLibroPorId(reserva.libroId)
    if (libro && libro.copiasDisponibles === 0) {
      libro.estado = "reservado"
    }

    return nuevaReserva
  }

  // ========== ESTADÍSTICAS ==========

  /**
   * Obtiene estadísticas generales de la biblioteca
   */
  getEstadisticas() {
    return {
      totalLibros: this.libros.length,
      librosDisponibles: this.libros.filter((l) => l.estado === "disponible").length,
      librosPrestados: this.libros.filter((l) => l.estado === "prestado").length,
      totalUsuarios: this.usuarios.filter((u) => u.activo).length,
      prestamosActivos: this.prestamos.filter((p) => p.estado === "activo").length,
      reservasActivas: this.reservas.filter((r) => r.estado === "activa").length,
    }
  }
}

// Instancia singleton de la base de datos
export const db = new DatabaseService()
