/**
 * Simulador de base de datos usando archivos JSON
 * Este módulo maneja todas las operaciones CRUD para el sistema de biblioteca
 */
// Importar datos JSON (simulando una base de datos)
import usuariosData from "@/db/usuarios.json";
import librosData from "@/db/libros.json";
import prestamosData from "@/db/prestamos.json";
import reservasData from "@/db/reservas.json";
// Clase para manejar operaciones de base de datos
export class DatabaseService {
    constructor() {
        this.usuarios = usuariosData.usuarios;
        this.libros = librosData.libros;
        this.prestamos = prestamosData.prestamos;
        this.reservas = reservasData.reservas;
    }
    // ========== OPERACIONES DE USUARIOS ==========
    /**
     * Obtiene todos los usuarios
     */
    getUsuarios() {
        return this.usuarios;
    }
    /**
     * Busca un usuario por ID
     */
    getUsuarioPorId(id) {
        return this.usuarios.find((usuario) => usuario.id === id);
    }
    /**
     * Busca un usuario por correo electrónico
     */
    getUsuarioPorCorreo(correo) {
        return this.usuarios.find((usuario) => usuario.correo === correo);
    }
    /**
     * Autentica un usuario con correo y contraseña
     */
    autenticarUsuario(correo, contraseña) {
        const usuario = this.getUsuarioPorCorreo(correo);
        if (usuario && usuario.contraseña === contraseña && usuario.activo) {
            return usuario;
        }
        return null;
    }
    /**
     * Registra un nuevo usuario
     */
    registrarUsuario(usuario) {
        const nuevoId = (Math.max(...this.usuarios.map((u) => Number.parseInt(u.id))) + 1).toString();
        const nuevoUsuario = Object.assign(Object.assign({}, usuario), { id: nuevoId });
        this.usuarios.push(nuevoUsuario);
        return nuevoUsuario;
    }
    // ========== OPERACIONES DE LIBROS ==========
    /**
     * Obtiene todos los libros
     */
    getLibros() {
        return this.libros;
    }
    /**
     * Busca un libro por ID
     */
    getLibroPorId(id) {
        return this.libros.find((libro) => libro.id === id);
    }
    /**
     * Busca libros por título, autor o categoría
     */
    buscarLibros(termino) {
        const terminoLower = termino.toLowerCase();
        return this.libros.filter((libro) => libro.titulo.toLowerCase().includes(terminoLower) ||
            libro.autor.toLowerCase().includes(terminoLower) ||
            libro.categoria.toLowerCase().includes(terminoLower));
    }
    /**
     * Filtra libros por categoría
     */
    getLibrosPorCategoria(categoria) {
        return this.libros.filter((libro) => libro.categoria === categoria);
    }
    /**
     * Obtiene todas las categorías únicas
     */
    getCategorias() {
        return [...new Set(this.libros.map((libro) => libro.categoria))];
    }
    // ========== OPERACIONES DE PRÉSTAMOS ==========
    /**
     * Obtiene todos los préstamos
     */
    getPrestamos() {
        return this.prestamos;
    }
    /**
     * Obtiene préstamos con información extendida (usuario y libro)
     */
    getPrestamosExtendidos() {
        return this.prestamos.map((prestamo) => (Object.assign(Object.assign({}, prestamo), { usuario: this.getUsuarioPorId(prestamo.usuarioId), libro: this.getLibroPorId(prestamo.libroId) })));
    }
    /**
     * Obtiene préstamos activos
     */
    getPrestamosActivos() {
        return this.getPrestamosExtendidos().filter((prestamo) => prestamo.estado === "activo");
    }
    /**
     * Obtiene préstamos de un usuario específico
     */
    getPrestamosPorUsuario(usuarioId) {
        return this.getPrestamosExtendidos().filter((prestamo) => prestamo.usuarioId === usuarioId);
    }
    /**
     * Crea un nuevo préstamo
     */
    crearPrestamo(prestamo) {
        const nuevoId = (Math.max(...this.prestamos.map((p) => Number.parseInt(p.id))) + 1).toString();
        const nuevoPrestamo = Object.assign(Object.assign({}, prestamo), { id: nuevoId });
        this.prestamos.push(nuevoPrestamo);
        // Actualizar disponibilidad del libro
        const libro = this.getLibroPorId(prestamo.libroId);
        if (libro && libro.copiasDisponibles > 0) {
            libro.copiasDisponibles--;
            if (libro.copiasDisponibles === 0) {
                libro.estado = "prestado";
            }
        }
        return nuevoPrestamo;
    }
    /**
     * Devuelve un libro (marca el préstamo como devuelto)
     */
    devolverLibro(prestamoId) {
        const prestamo = this.prestamos.find((p) => p.id === prestamoId);
        if (prestamo && prestamo.estado === "activo") {
            prestamo.estado = "devuelto";
            prestamo.fechaDevolucion = new Date().toISOString().split("T")[0];
            // Actualizar disponibilidad del libro
            const libro = this.getLibroPorId(prestamo.libroId);
            if (libro) {
                libro.copiasDisponibles++;
                if (libro.copiasDisponibles > 0 && libro.estado === "prestado") {
                    libro.estado = "disponible";
                }
            }
            return true;
        }
        return false;
    }
    // ========== OPERACIONES DE RESERVAS ==========
    /**
     * Obtiene todas las reservas
     */
    getReservas() {
        return this.reservas;
    }
    /**
     * Obtiene reservas con información extendida
     */
    getReservasExtendidas() {
        return this.reservas.map((reserva) => (Object.assign(Object.assign({}, reserva), { usuario: this.getUsuarioPorId(reserva.usuarioId), libro: this.getLibroPorId(reserva.libroId) })));
    }
    /**
     * Obtiene reservas activas
     */
    getReservasActivas() {
        return this.getReservasExtendidas().filter((reserva) => reserva.estado === "activa");
    }
    /**
     * Crea una nueva reserva
     */
    crearReserva(reserva) {
        const nuevoId = (Math.max(...this.reservas.map((r) => Number.parseInt(r.id))) + 1).toString();
        const nuevaReserva = Object.assign(Object.assign({}, reserva), { id: nuevoId });
        this.reservas.push(nuevaReserva);
        // Actualizar estado del libro si es necesario
        const libro = this.getLibroPorId(reserva.libroId);
        if (libro && libro.copiasDisponibles === 0) {
            libro.estado = "reservado";
        }
        return nuevaReserva;
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
        };
    }
}
// Instancia singleton de la base de datos
export const db = new DatabaseService();
