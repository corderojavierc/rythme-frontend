# RythMe — Frontend - Hecho por Javier Cordero Martín


Aplicación web de la plataforma social de música **RythMe**, construida con **React 19** y **Vite 8**.

---

## Tecnologías principales

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.x | Framework UI |
| React Router DOM | 7.x | Enrutado client-side |
| Vite | 8.x | Bundler y servidor de desarrollo |
| React Compiler | 1.x | Optimización automática de renders |
| Heroicons | 2.x | Iconos SVG |
| ESLint + Prettier | 9.x / 3.x | Linting y formato de código |

---

## Requisitos previos

- Node.js 18 o superior
- npm
- El backend de RythMe corriendo en `http://localhost:8000`

---

## Instalación

```bash
npm install
```

---

## Arranque en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

> Asegúrate de que el backend está corriendo antes de abrir el frontend.

---

## Configuración

La URL base de la API está definida en `src/config.js`:

```js
// src/config.js
export const API_URL = "http://localhost:8000/api";
```

Cámbiala si tu backend corre en un puerto o dominio diferente.

La autenticación funciona mediante un token Bearer guardado en `localStorage`. Se gestiona automáticamente a través del contexto de autenticación (`src/auth/`).

---

## Estructura del proyecto

```
src/
├── routes/              # Páginas / vistas de la aplicación
├── components/
│   ├── user/            # Componentes de perfil y búsqueda de usuarios
│   ├── post/            # Creación, visualización, likes y comentarios de posts
│   ├── music/           # Tarjetas de música, rankings y filtros
│   ├── comment/         # Visualización y creación de comentarios
│   ├── application/     # Flujo de solicitud de artista/creador
│   ├── search/          # Búsqueda multi-entidad
│   └── layout/          # Wrappers de layout
├── auth/                # Proveedor de autenticación y guards de rutas
├── providers/           # Contextos globales (Auth, Data, Post)
├── hooks/               # Custom hooks (ej. usePaginatedFetch)
├── config.js            # URL de la API
└── main.jsx             # Configuración de React Router y punto de entrada
```

---

## Rutas de la aplicación

### Rutas públicas (sin sesión)

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión |
| `/register` | Registro de nuevo usuario |

### Rutas protegidas (requieren sesión)

| Ruta | Descripción |
|---|---|
| `/` | Feed global |
| `/followed` | Feed de usuarios seguidos |
| `/music` | Biblioteca global de música |
| `/rate` | Crear una valoración (post) |
| `/music/:id` | Detalle de una canción con sus posts |
| `/:username` | Perfil público de un usuario |
| `/:username/posts/:id` | Detalle de un post |
| `/:username/posts/:id/comment` | Vista de comentarios de un post |
| `/search` | Búsqueda global (música, usuarios y posts) |
| `/events` | Listado de eventos musicales |
| `/request` | Información sobre la solicitud de artista |
| `/request/form` | Formulario de solicitud de artista/creador |

---

## Scripts disponibles

```bash
# Servidor de desarrollo con HMR
npm run dev

# Build de producción
npm run build

# Vista previa del build de producción
npm run preview

# Linting con ESLint
npm run lint
```

---

## Build de producción

```bash
npm run build
```

Genera los archivos estáticos en `dist/`. Sirve esa carpeta con cualquier servidor web estático (Nginx, Apache, Vercel, etc.) apuntando todas las rutas a `index.html` para que React Router funcione correctamente.
