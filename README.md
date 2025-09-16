# Sistema de Gestión de Biblioteca Virtual - Frontend

Este proyecto es la implementación del **frontend** para un Sistema de Gestión de Biblioteca Virtual, basado en los requerimientos del documento `practica2.pdf`. La aplicación está siendo desarrollada con Next.js y TypeScript.

## Estado Actual del Proyecto

**Importante:** Este es un desarrollo exclusivamente del **frontend**. Actualmente, **no tiene conexión a un backend ni a una base de datos real**. 

Para simular el comportamiento y la data, el proyecto utiliza archivos JSON estáticos ubicados en el directorio `/db`. Esto permite desarrollar y probar la interfaz de usuario de forma aislada.

## Requisitos del Proyecto (Según `practica2.pdf`)

### Requisitos Funcionales (RF)
- **RF1:** Registrar usuarios (estudiantes y docentes).
- **RF2:** Iniciar sesión con usuario y contraseña.
- **RF3:** Consultar catálogo de libros por título, autor o categoría.
- **RF4:** Reservar un libro disponible.
- **RF5:** Prestar un libro.
- **RF6:** Registrar la devolución de un libro.
- **RF7:** Generar un reporte de préstamos activos.

## Stack Tecnológico

- **Framework:** [Next.js](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Gestor de Paquetes:** [pnpm](https://pnpm.io/)

## Cómo Empezar

Sigue estos pasos para levantar el proyecto en tu entorno local:

1.  **Clonar el repositorio (si aplica):**
    ```bash
    git clone <url-del-repositorio>
    cd frontend
    ```

2.  **Instalar dependencias:**
    Se utiliza `pnpm` como gestor de paquetes.
    ```bash
    pnpm install
    ```

3.  **Ejecutar el servidor de desarrollo:**
    ```bash
    pnpm run dev
    ```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura de Carpetas

- **/app**: Contiene las rutas y páginas de la aplicación, siguiendo el App Router de Next.js.
- **/components**: Almacena los componentes reutilizables de React (UI, layout, etc.).
  - **/components/ui**: Componentes de la librería `shadcn/ui`.
  - **/components/auth**: Formularios de login y registro.
- **/db**: Contiene los archivos `*.json` que simulan la base de datos para el desarrollo del frontend.
- **/hooks**: Hooks personalizados de React para lógica reutilizable.
- **/lib**: Funciones de utilidad (helpers, utils).
- **/public**: Archivos estáticos como imágenes y logos.
