/**
 * Definiciones de tipos TypeScript para el sistema de biblioteca
 * Estas interfaces definen la estructura de datos para usuarios, libros, préstamos y reservas
 */

// Tipo de usuario en el sistema
export type TipoUsuario = "estudiante" | "docente" | "bibliotecario"

// Estado de los libros
export type EstadoLibro = "disponible" | "prestado" | "reservado" | "mantenimiento"

// Estado de los préstamos
export type EstadoPrestamo = "activo" | "devuelto" | "vencido" | "reservado"

// Estado de las reservas
export type EstadoReserva = "activa" | "expirada" | "completada"

// Interfaz para Usuario
export interface Usuario {
  id: string
  nombre: string
  correo: string
  contraseña: string
  tipo: TipoUsuario
  fechaRegistro: string
  activo: boolean
}

// Interfaz para Libro
export interface Libro {
  id: string
  titulo: string
  autor: string
  categoria: string
  isbn: string
  estado: EstadoLibro
  fechaPublicacion: string
  editorial: string
  copias: number
  copiasDisponibles: number
}

// Interfaz para Préstamo
export interface Prestamo {
  id: string
  usuarioId: string
  libroId: string
  fechaInicio: string
  fechaFin: string
  fechaDevolucion: string | null
  estado: EstadoPrestamo
  renovaciones: number
  multa: number
}

// Interfaz para Reserva
export interface Reserva {
  id: string
  usuarioId: string
  libroId: string
  fechaReserva: string
  fechaExpiracion: string
  estado: EstadoReserva
}

// Interfaz para datos extendidos de préstamo (con información de usuario y libro)
export interface PrestamoExtendido extends Prestamo {
  usuario?: Usuario
  libro?: Libro
}

// Interfaz para datos extendidos de reserva (con información de usuario y libro)
export interface ReservaExtendida extends Reserva {
  usuario?: Usuario
  libro?: Libro
}

// Interfaz para estadísticas del dashboard
export interface EstadisticasBiblioteca {
  totalLibros: number
  librosDisponibles: number
  librosPrestados: number
  totalUsuarios: number
  prestamosActivos: number
  reservasActivas: number
}
