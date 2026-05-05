# 📘 Guía React para RythMe — Parte 3: React Router y Patrones Avanzados

> 👉 **Partes de esta guía:**
> - **Parte 1** — Fundamentos, JSX, Componentes, Props, `useState`
> - **Parte 2** — `useEffect`, `useRef`, `useContext`, Providers
> - **Parte 3** ← estás aquí — React Router, Patrones avanzados, Flujo global

---

## 📚 Índice

1. [React Router: navegación en una SPA](#1-react-router-navegación-en-una-spa)
2. [`useNavigate`: navegación programática](#2-usenavigate-navegación-programática)
3. [`useLocation`: leer la URL actual](#3-uselocation-leer-la-url-actual)
4. [`useParams`: parámetros de la URL](#4-useparams-parámetros-de-la-url)
5. [`<Outlet>`: rutas anidadas](#5-outlet-rutas-anidadas)
6. [Rutas protegidas y públicas](#6-rutas-protegidas-y-públicas)
7. [Pasar datos entre páginas con `location.state`](#7-pasar-datos-entre-páginas-con-locationstate)
8. [Flujo completo de la aplicación](#8-flujo-completo-de-la-aplicación)
9. [Patrones frecuentes en el proyecto](#9-patrones-frecuentes-en-el-proyecto)
10. [Resumen visual de hooks](#10-resumen-visual-de-hooks)

---

## 1. React Router: navegación en una SPA

RythMe es una **Single Page Application (SPA)**. Esto significa que solo hay un archivo HTML y React es quien simula la navegación entre "páginas" actualizando el DOM sin recargar el navegador.

**React Router** es la librería que hace posible esto: mapea URLs a componentes.

### Cómo se define el router en RythMe

```jsx
// src/main.jsx — líneas 25-101
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,      // ← guarda la ruta
    children: [
      {
        element: <Home />,            // ← layout compartido
        children: [
          { path: "/",           element: <Feed /> },
          { path: "/followed",   element: <FollowedsPosts /> },
          { path: "/music",      element: <GlobalMusicPage /> },
          { path: "/music/:id",  element: <MusicPage /> },       // :id es dinámico
          { path: "/rate",       element: <CreatePost /> },
          { path: "/events",     element: <GlobalEventPage /> },
          { path: "/request",    element: <ApplicationPage /> },
          { path: "/search",     element: <SearchPage /> },
          { path: ":username",   element: <ProfilePage /> },      // :username dinámico
          { path: ":username/posts/:id",         element: <PostPage /> },
          { path: ":username/posts/:id/comment", element: <CommentPage /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,    // ← ruta pública
  },
  {
    path: "/register",
    element: <PublicRoute><Register /></PublicRoute>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </AuthProvider>,
);
```

### Árbol de rutas anidadas

```
/                  → ProtectedRoute → Home → Feed
/followed          → ProtectedRoute → Home → FollowedsPosts
/music             → ProtectedRoute → Home → GlobalMusicPage
/music/42          → ProtectedRoute → Home → MusicPage (id=42)
/rate              → ProtectedRoute → Home → CreatePost
/maria             → ProtectedRoute → Home → ProfilePage (username=maria)
/maria/posts/7     → ProtectedRoute → Home → PostPage (username=maria, id=7)
/login             → PublicRoute → Login
/register          → PublicRoute → Register
```

La profundidad del árbol es:
```
AuthProvider → DataProvider → RouterProvider
  └── ProtectedRoute
        └── Home (AsideLayout + RightAside + main)
              └── <Outlet> ← aquí se renderiza la ruta activa
```

---

## 2. `useNavigate`: navegación programática

`useNavigate` devuelve una función que permite **navegar a otra ruta desde código** JavaScript, no desde un link estático.

```jsx
const navigate = useNavigate();

navigate("/ruta");              // navega a /ruta
navigate(-1);                   // vuelve a la página anterior (como el botón Atrás)
navigate("/ruta", { replace: true }); // reemplaza la entrada en el historial
navigate("/ruta", { state: { datos } }); // pasa datos a la nueva página
```

### ¿Cuándo usar `navigate` vs `<Link>`?

| Situación | Herramienta |
|---|---|
| Enlace que el usuario puede ver y clicar | `<Link to="/ruta">` |
| Redirigir tras una acción (login, submit, logout) | `navigate("/ruta")` |
| Volver atrás | `navigate(-1)` |
| Redirigir en el render (sin acción del usuario) | `<Navigate to="/ruta" />` |

### Ejemplo: navegación al hacer login

```jsx
// src/routes/Login.jsx — líneas 45-48
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
auth.setIsAuthenticated(true);
navigate("/"); // ← navega al feed tras login exitoso
```

### Ejemplo: botón de "volver atrás"

```jsx
// src/routes/ProfilePage.jsx — líneas 193-200
<button
  className="back-button"
  title="Go Back"
  onClick={() => navigate(-1)}  // -1 = página anterior en el historial
>
  <span className="material-symbols-outlined">arrow_back</span>
</button>
```

### Ejemplo: logout y redirección

```jsx
// src/layout/AsideLayout.jsx — líneas 40-59
const handleLogout = async () => {
  try {
    await fetch("http://127.0.0.1:8000/api/logout", { method: "POST", ... });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    auth.setIsAuthenticated(false);
    navigate("/login"); // ← redirige al login
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
```

### Ejemplo: navegar a una ruta dinámica

```jsx
// src/components/post/PostCardComponent.jsx — líneas 17-22
function redirectToPost() {
  if (type === "fromPost") return;   // si ya estamos en el post, no hacer nada
  navigate(`/${post.user_name}/posts/${post.id}`, {
    state: { post },                 // pasa el objeto post como state
  });
}
```

Las template literals `` `/${post.user_name}/posts/${post.id}` `` construyen la URL dinámicamente.

### Ejemplo: limpiar el state de la URL después de usarlo

```jsx
// src/routes/Home.jsx — líneas 41-43
useEffect(() => {
  if (location.state?.from) {
    navigate(location.pathname, { replace: true, state: {} }); // limpia el state
  }
}, [notificationType]);
```

`{ replace: true }` reemplaza la entrada actual en el historial en lugar de añadir una nueva. Así el botón "Atrás" no vuelve al state con la notificación.

---

## 3. `useLocation`: leer la URL actual

`useLocation` devuelve el objeto de ubicación actual con:
- `pathname` — el path de la URL: `/maria/posts/7`
- `search` — los query params: `?tab=likes`
- `hash` — el hash: `#sección`
- `state` — datos pasados mediante `navigate(url, { state })` o `<Link state={}>`

### Ejemplo: resaltar el enlace activo en la barra lateral

```jsx
// src/layout/AsideLayout.jsx — líneas 10-14
const location = useLocation();
const currentPath = location.pathname;

function getLinkClass(path) {
  if (currentPath === path) {
    return "nav-item active";   // ← clase extra para el enlace activo
  }
  return "nav-item";
}
```

```jsx
// Línea 85
<Link className={getLinkClass("/")} to="/">
  <span className="material-symbols-outlined">home</span>
  Feed
</Link>
```

Cuando estás en `/`, el link de Feed tiene la clase `"nav-item active"`. Cuando estás en `/music`, solo tiene `"nav-item"`.

### Ejemplo: detectar desde dónde venimos para mostrar notificaciones

```jsx
// src/routes/Home.jsx — líneas 20-32
const from = location.state?.from;  // "post", "comment", "error-song-exists"

if (from && from !== prevFrom) {
  const isValidNotification =
    from === "comment" || from === "post" || from === "error-song-exists";

  if (isValidNotification) {
    setPrevFrom(from);
    setNotificationType(from);
    setShowNotification(true);
  }
}
```

Cuando el usuario crea un post y navega al feed con `navigate("/", { state: { from: "post" } })`, el `Home` detecta ese `from` y muestra la notificación "¡Post publicado!".

---

## 4. `useParams`: parámetros de la URL

Las rutas dinámicas tienen segmentos precedidos de `:`. `useParams` extrae esos valores:

```jsx
// Ruta definida: path: ":username/posts/:id"
// URL actual:    /maria/posts/42

const { username, id } = useParams();
// username === "maria"
// id === "42"
```

### Ejemplo: cargar el perfil según el username de la URL

```jsx
// src/routes/ProfilePage.jsx — líneas 13-14
const { username } = useParams();
```

Luego se usa para hacer la petición a la API:

```jsx
// Línea 122
let response = await fetch(`${getApi()}/users/${username}`, { ... });
```

Y para saber si estamos viendo nuestro propio perfil:

```jsx
// Línea 21
const isOwnProfile = username === storedUserInit.username;
```

### Ejemplo: cargar el post y sus comentarios

```jsx
// src/routes/PostPage.jsx — línea 12
const { id } = useParams();
```

```jsx
// Línea 62-70
fetch(getApi() + "/posts/" + id, {
  headers: { Authorization: "Bearer " + token },
})
  .then((res) => res.json())
  .then((data) => setPost(data.data || data))
  .catch((err) => console.error(err))
  .finally(() => setIsLoadingPost(false));
```

---

## 5. `<Outlet>`: rutas anidadas

Cuando tienes rutas anidadas, `<Outlet>` es el "hueco" donde se renderiza la ruta hija activa.

```jsx
// src/routes/Home.jsx — línea 83
<main className="main">
  <Outlet />  {/* ← aquí se renderiza Feed, ProfilePage, MusicPage, etc. */}
</main>
```

Esto permite que `Home` tenga siempre el mismo layout (AsideLayout + RightAside) y solo cambie el contenido central:

```jsx
// src/routes/Home.jsx
return (
  <div className="app-container">
    <AsideLayout />           {/* siempre visible */}

    <main className="main">
      <Outlet />              {/* cambia según la ruta: Feed, ProfilePage, etc. */}
    </main>

    <RightAsideLayout />      {/* siempre visible */}
    ...
  </div>
);
```

Y también en `ProtectedRoute`:

```jsx
// src/routes/ProtectedRoute.jsx
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;  // ← renderiza las rutas hijas si está autenticado
}
```

---

## 6. Rutas protegidas y públicas

### `ProtectedRoute`: solo para usuarios autenticados

```jsx
// src/routes/ProtectedRoute.jsx
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

Si el usuario no está autenticado y intenta acceder a `/`, `/music`, etc., es redirigido a `/login`. `replace: true` evita que pueda volver atrás con el botón del navegador.

### `PublicRoute`: solo para usuarios NO autenticados

```jsx
// src/routes/PublicRoute.jsx
export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

Si el usuario ya está logueado e intenta ir a `/login` o `/register`, lo redirige al feed. Así no puede acceder a esas páginas cuando ya tiene sesión iniciada.

Se usa en `main.jsx` como un **wrapper**:

```jsx
{
  path: "/login",
  element: (
    <PublicRoute>
      <Login />
    </PublicRoute>
  ),
}
```

---

## 7. Pasar datos entre páginas con `location.state`

`location.state` es un mecanismo para pasar datos de una página a otra **sin ponerlos en la URL**. Es útil para pasar objetos completos que ya tienes en memoria y evitar tener que hacer otra petición a la API.

### Cómo funciona

**Página que envía:**

```jsx
// src/components/post/PostCardComponent.jsx — líneas 17-22
navigate(`/${post.user_name}/posts/${post.id}`, {
  state: { post },  // ← pasas el objeto completo
});
```

**Página que recibe:**

```jsx
// src/routes/PostPage.jsx — líneas 22-27
const [post, setPost] = useState(() => {
  if (location.state?.post) return location.state.post; // ← usa los datos del state

  // Si no hay state, busca en el caché de DataProvider
  const allPosts = [...posts, ...followedPosts, ...musicPosts];
  return allPosts.find((p) => String(p.id) === String(id));
});
```

### Estrategia de carga en cascada

Este patrón aparece en `PostPage`, `MusicPage`, `ProfilePage` y `CommentPage`. La idea es **priorizar fuentes de datos más rápidas**:

```
1. ¿Hay datos en location.state?
   → Sí: úsalos, carga instantánea sin petición de red
   → No: continúa

2. ¿Está el post en el caché de DataProvider?
   → Sí: úsalos, tampoco hay petición de red
   → No: continúa

3. Fetch a la API (última opción, más lenta)
```

```jsx
// src/routes/PostPage.jsx — líneas 53-80
useEffect(() => {
  if (
    !post &&                  // no tengo el post todavía
    id &&                     // sé qué post buscar
    !loadingPosts &&          // el DataProvider ya terminó de cargar
    !loadingFollowedPosts &&
    !loadingMusicPosts &&
    isLoadingPost             // estoy esperando este post
  ) {
    fetch(getApi() + "/posts/" + id, ...)
      .then(...)
      .finally(() => setIsLoadingPost(false));
  }
}, [id, loadingPosts, loadingFollowedPosts, loadingMusicPosts, token, post, isLoadingPost]);
```

La condición espera a que el `DataProvider` haya terminado de cargar sus listas antes de hacer el fetch, porque quizás el post ya está ahí.

---

## 8. Flujo completo de la aplicación

Aquí se explica paso a paso qué ocurre desde que el usuario abre la app hasta que ve el feed:

```
1. El navegador carga index.html
2. React se monta en el div#root
3. main.jsx renderiza:
   <AuthProvider>          ← lee isAuthenticated de localStorage
     <DataProvider>        ← todavía no carga nada (espera a isAuthenticated)
       <RouterProvider>
```

**Caso: usuario NO autenticado → va a /login**

```
4. RouterProvider evalúa la ruta "/"
5. Renderiza <ProtectedRoute>
6. ProtectedRoute: isAuthenticated === false → <Navigate to="/login" replace />
7. Login se muestra al usuario
8. El usuario introduce sus credenciales y pulsa submit
9. handleSubmit llama a la API POST /login
10. API devuelve { token, user }
11. Se guardan en localStorage
12. auth.setIsAuthenticated(true) → AuthContext se actualiza
13. navigate("/") → RouterProvider va a la ruta "/"
14. ProtectedRoute: isAuthenticated === true → <Outlet />
```

**DataProvider reacciona al cambio de isAuthenticated:**

```
15. useEffect de DataProvider se ejecuta (isAuthenticated cambió a true)
16. fetchPosts(), fetchFollowedPosts(), fetchRecommendedUsers() en paralelo
17. isInitialized === false → Home muestra <LoaderScreen text="Cargando Rythme..." />
18. Las peticiones terminan → isInitialized = true
19. Home ya no muestra LoaderScreen → renderiza el layout con <Outlet />
20. <Outlet /> renderiza <Feed />
21. Feed lee `posts` del DataContext y renderiza <PostCardComponent> por cada post
22. El usuario ve el feed ✅
```

**Caso: usuario navega al perfil de alguien**

```
23. Hace click en un PostCard → redirectToProfile(e)
24. e.stopPropagation() → no navega también al post
25. navigate("/maria", { state: { id, username, name, ... } })
26. RouterProvider renderiza <ProfilePage>
27. useState lazy init: hay location.state → usa esos datos, carga inmediata
28. useEffect([username]): hace fetch a la API para datos completos y actualizados
29. ProfilePage muestra los datos del state mientras carga, luego los actualiza
```

---

## 9. Patrones frecuentes en el proyecto

### Patrón 1: Comparar IDs como strings

```jsx
// src/routes/ProfilePage.jsx — línea 171
const isMe = loggedInUser.id && String(user.id) === String(loggedInUser.id);
```

Los IDs de la API pueden llegar como `number` o `string` dependiendo del endpoint. Convertir ambos a `String` antes de comparar evita que `42 === "42"` devuelva `false`.

### Patrón 2: Optional chaining `?.`

```jsx
const nextUrl = data.links?.next ?? null;
// equivale a:
const nextUrl = data.links ? data.links.next : null;
```

`?.` accede a la propiedad solo si el objeto no es `null`/`undefined`. Si `data.links` no existe, devuelve `undefined` en lugar de lanzar un error.

### Patrón 3: Nullish coalescing `??`

```jsx
const nextUrl = data.links?.next ?? null;
```

`??` devuelve el lado derecho solo si el izquierdo es `null` o `undefined` (no si es `0` o `""`). Es más seguro que `||` cuando `0` o `""` son valores válidos.

### Patrón 4: Función `extractList` helper

```jsx
// src/providers/DataProvider.jsx — líneas 8-12
function extractList(responseData) {
  if (responseData.data) return responseData.data;
  if (Array.isArray(responseData)) return responseData;
  return [];
}
```

La API puede devolver los datos en varios formatos: `{ data: [...] }` (paginado) o directamente `[...]`. Esta función normaliza ambos casos. En lugar de duplicar esa lógica en cada función, se extrae a un helper.

### Patrón 5: `prevState` para detectar cambios sin useEffect

```jsx
// src/routes/ProfilePage.jsx — líneas 40-107
const [prevUsername, setPrevUsername] = useState(username);

if (username !== prevUsername) {
  setPrevUsername(username);
  // actualizar el estado del user según el nuevo username
}
```

Este patrón (llamado "derived state" o comparación de estado previo) se usa para responder a cambios de props **dentro del render** en lugar de en un `useEffect`. React permite llamar a `setState` durante el render si está dentro de una condición, y aplazará el nuevo render hasta después del actual.

> 💡 En la mayoría de casos es mejor usar `useEffect`, pero este patrón evita un render adicional en ciertos casos donde necesitas actualizar el estado sincronizadamente con el render.

### Patrón 6: Controlled components (formularios)

```jsx
// src/routes/Login.jsx — líneas 11-82
const [username, setUsername] = useState("");

<input
  value={username}                               // ← valor controlado por React
  onChange={(e) => setUsername(e.target.value)}  // ← actualiza el estado
/>
```

En un formulario controlado, React es la **única fuente de verdad** del valor del input. Esto permite:
- Validar en tiempo real.
- Limpiar el formulario con `setUsername("")`.
- Leer el valor fácilmente desde el estado sin acceder al DOM.

### Patrón 7: Funciones auto-invocadas en useEffect

Como `useEffect` no puede recibir una función `async` directamente:

```jsx
// ❌ No funciona (no se puede poner async directamente)
useEffect(async () => { ... }, []);

// ✅ Define la función async dentro y llámala
useEffect(() => {
  const load = async () => {
    const data = await fetch(...);
    // ...
  };
  load();
}, []);
```

Este patrón aparece en `ApplicationComponent`, `ProfilePage`, `MusicPage` y otros.

### Patrón 8: Actualización optimista con reversión

Ver [Parte 2 — `toggleFollow`](#7-dataprovider-el-cerebro-de-la-app). El resumen:

1. Actualiza la UI inmediatamente (sin esperar al servidor).
2. Llama al servidor.
3. Si falla, revierte al estado anterior.

Esto hace que la app se sienta más rápida.

### Patrón 9: Evento personalizado del navegador

```jsx
// Disparar el evento — cuando se actualiza el usuario
window.dispatchEvent(new Event("userUpdated"));

// Escuchar el evento — en AsideLayout
useEffect(() => {
  const handleUserUpdate = () => {
    const userJson = localStorage.getItem("user");
    setUser(userJson ? JSON.parse(userJson) : {});
  };
  window.addEventListener("userUpdated", handleUserUpdate);
  return () => window.removeEventListener("userUpdated", handleUserUpdate);
}, []);
```

Este patrón se usa para comunicar entre componentes que **no tienen relación directa** en el árbol y que no comparten un contexto. `ApplicationComponent` actualiza el usuario y dispara el evento; `AsideLayout` escucha y actualiza su estado local del usuario.

---

## 10. Resumen visual de hooks

```
┌─────────────────────────────────────────────────────────────────┐
│                      HOOKS USADOS EN RYTHME                     │
├──────────────┬──────────────────────────────┬───────────────────┤
│   Hook       │   Para qué sirve             │   Archivos        │
├──────────────┼──────────────────────────────┼───────────────────┤
│ useState     │ Estado local con re-render   │ Todos los         │
│              │ al cambiar                   │ componentes       │
├──────────────┼──────────────────────────────┼───────────────────┤
│ useEffect    │ Efectos secundarios:         │ AsideLayout,      │
│              │ fetches, listeners, timers   │ ProfilePage,      │
│              │                              │ DataProvider...   │
├──────────────┼──────────────────────────────┼───────────────────┤
│ useRef       │ Valor persistente SIN        │ DataProvider      │
│              │ re-render                    │ PostLikeButton    │
├──────────────┼──────────────────────────────┼───────────────────┤
│ useContext   │ Leer el contexto             │ Dentro de useAuth │
│              │                              │ useData           │
│              │                              │ usePostContext    │
├──────────────┼──────────────────────────────┼───────────────────┤
│ createContext│ Crear un canal de datos      │ AuthProvider      │
│              │                              │ DataProvider      │
│              │                              │ PostProvider      │
├──────────────┼──────────────────────────────┼───────────────────┤
│ useNavigate  │ Navegar programáticamente    │ AsideLayout,      │
│              │                              │ Login,            │
│              │                              │ PostCardComponent │
├──────────────┼──────────────────────────────┼───────────────────┤
│ useLocation  │ Leer pathname y state        │ AsideLayout,      │
│              │ de la URL actual             │ Home,             │
│              │                              │ ProfilePage...    │
├──────────────┼──────────────────────────────┼───────────────────┤
│ useParams    │ Leer :params dinámicos       │ ProfilePage,      │
│              │ de la URL                    │ PostPage,         │
│              │                              │ MusicPage         │
└──────────────┴──────────────────────────────┴───────────────────┘
```

---

## ✅ Índice global de los tres archivos

Si quieres buscar algo concreto, aquí tienes dónde está cada tema:

| Tema | Archivo |
|---|---|
| Qué es React, JSX, reglas de JSX | Parte 1 |
| Componentes, export default | Parte 1 |
| Props, children, valor por defecto | Parte 1 |
| `useState` básico, booleano, múltiple | Parte 1 |
| Lazy initializer de `useState` | Parte 1 |
| Actualización funcional `setState(prev => ...)` | Parte 1 |
| Renderizado condicional `&&`, ternario, `\|\|` | Parte 1 |
| Listas con `.map()` y la prop `key` | Parte 1 |
| Manejo de eventos, `stopPropagation` | Parte 1 |
| `useEffect` con `[]` (una sola vez) | Parte 2 |
| `useEffect` con dependencias | Parte 2 |
| Cleanup de `useEffect` | Parte 2 |
| `useRef` como flag sin re-render | Parte 2 |
| Context API, `createContext`, `useContext` | Parte 2 |
| `AuthProvider` — autenticación global | Parte 2 |
| `PostProvider` — estado local de un post | Parte 2 |
| `DataProvider` — datos globales de la app | Parte 2 |
| Actualización optimista con rollback | Parte 2 |
| `Promise.all` para peticiones en paralelo | Parte 2 |
| React Router, definición de rutas | Parte 3 |
| `useNavigate` — navegar programáticamente | Parte 3 |
| `useLocation` — leer URL y state | Parte 3 |
| `useParams` — parámetros dinámicos de la URL | Parte 3 |
| `<Outlet>` — rutas anidadas | Parte 3 |
| Rutas protegidas y públicas | Parte 3 |
| Pasar datos entre páginas con `location.state` | Parte 3 |
| Flujo completo de la app (login → feed) | Parte 3 |
| Optional chaining `?.`, nullish coalescing `??` | Parte 3 |
| Formularios controlados | Parte 3 |
| Eventos personalizados del navegador | Parte 3 |

---

*¡Suerte con el proyecto! 🎵*
