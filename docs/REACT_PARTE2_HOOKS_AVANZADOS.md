# 📘 Guía React para RythMe — Parte 2: `useEffect`, `useRef`, `useContext` y Providers

> 👉 **Partes de esta guía:**
> - **Parte 1** — Fundamentos, JSX, Componentes, Props, `useState`
> - **Parte 2** ← estás aquí — `useEffect`, `useRef`, `useContext`, Providers
> - **Parte 3** — React Router, Patrones avanzados, Flujo global de la app

---

## 📚 Índice

1. [`useEffect`: efectos secundarios](#1-useeffect-efectos-secundarios)
2. [`useRef`: referencias sin re-render](#2-useref-referencias-sin-re-render)
3. [Context API y `useContext`](#3-context-api-y-usecontext)
4. [Cómo se construye un Provider en RythMe](#4-cómo-se-construye-un-provider-en-rythme)
5. [`AuthProvider`: autenticación global](#5-authprovider-autenticación-global)
6. [`PostProvider`: estado local de un post](#6-postprovider-estado-local-de-un-post)
7. [`DataProvider`: el cerebro de la app](#7-dataprovider-el-cerebro-de-la-app)

---

## 1. `useEffect`: efectos secundarios

### ¿Qué es un efecto secundario?

Un **efecto secundario** es cualquier cosa que sale del mundo de React: peticiones a APIs, escuchar eventos del navegador, manipular el DOM directamente, temporizadores (`setTimeout`, `setInterval`), etc.

React garantiza que el JSX que devuelves es **puro**: dado el mismo estado, siempre produce el mismo resultado. Los efectos secundarios van fuera de esa lógica de renderizado, dentro de `useEffect`.

### Sintaxis

```jsx
useEffect(() => {
  // código del efecto
  return () => {
    // función de limpieza (cleanup) — opcional
  };
}, [dependencias]);  // array de dependencias — opcional
```

### Los tres modos de `useEffect`

| Array de dependencias | Cuándo se ejecuta |
|---|---|
| Sin array (omitido) | En **cada** render |
| `[]` vacío | **Solo una vez** al montar el componente |
| `[a, b]` con valores | Cuando monta, y cada vez que `a` o `b` cambian |

---

### Modo 1: ejecutar una sola vez al montar (`[]`)

```jsx
// src/components/application/ApplicationComponent.jsx — líneas 16-53
useEffect(() => {
  const checkStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const userRes = await fetch(`${getApi()}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        const actualUser = userData.data || userData;
        if (actualUser) {
          setUser(actualUser);
          localStorage.setItem("user", JSON.stringify(actualUser));
          window.dispatchEvent(new Event("userUpdated"));

          if (actualUser.type !== "user") {
            setIsLoading(false);
            return;
          }
        }
      }

      const res = await fetch(`${getApi()}/artist-applications/has`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHasApplication(data.has_application || data.is_accepted);
    } catch {
      setHasApplication(false);
    } finally {
      setIsLoading(false);
    }
  };

  checkStatus();
}, []); // <-- array vacío: solo al montar
```

**¿Por qué `[]`?** Cuando este componente aparece en pantalla, queremos hacer **una sola** llamada a la API para comprobar el estado. Si no pusiéramos `[]`, la llamada se haría en cada re-render, creando un bucle infinito (cada llamada actualiza el estado → re-render → otra llamada...).

> 💡 **Nota**: dentro de `useEffect` no puedes usar `async` directamente en la función que le pasas. Por eso se define una función `async` interna (`checkStatus`) y se llama inmediatamente.

---

### Modo 2: ejecutar cuando cambia una dependencia

```jsx
// src/routes/ProfilePage.jsx — líneas 109-168
useEffect(() => {
  window.scrollTo(0, 0);        // scroll al tope al cambiar de perfil
  setNotFound(false);
  if (!user.id) setLoading(true);

  const controller = new AbortController();  // para cancelar fetch
  const { signal } = controller;

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      let response = await fetch(`${getApi()}/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,  // fetch se puede cancelar con esta señal
      });

      if (!response.ok) {
        // buscar en la lista de todos los usuarios...
      }

      const data = await response.json();
      setUser(data.data || data);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching user data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUser();

  return () => controller.abort(); // cleanup: cancela el fetch si el componente se desmonta
}, [username]); // <-- se re-ejecuta cada vez que cambia el username en la URL
```

**¿Por qué `[username]`?** Si el usuario navega de `/maria` a `/juan` sin desmontar el componente (misma ruta, distinto parámetro), React detecta que `username` cambió y vuelve a ejecutar el efecto para cargar los datos del nuevo perfil.

---

### El `cleanup` (función de limpieza)

La función que devuelves desde `useEffect` se ejecuta cuando:
1. El componente **se desmonta** de la pantalla.
2. **Antes** de ejecutar el efecto de nuevo (cuando las dependencias cambian).

**Ejemplo 1: cancelar un fetch con `AbortController`**

```jsx
// src/routes/ProfilePage.jsx
const controller = new AbortController();
const { signal } = controller;

fetch(`${getApi()}/users/${username}`, { signal });

return () => controller.abort(); // cancela la petición si el componente desaparece
```

Si el usuario navega a otra página mientras se carga el perfil, el fetch se cancela y evitamos el error "Cannot setState on unmounted component".

**Ejemplo 2: quitar un event listener**

```jsx
// src/layout/AsideLayout.jsx — líneas 21-28
useEffect(() => {
  const handleUserUpdate = () => {
    const userJson = localStorage.getItem("user");
    setUser(userJson ? JSON.parse(userJson) : {});
  };

  window.addEventListener("userUpdated", handleUserUpdate);

  return () => window.removeEventListener("userUpdated", handleUserUpdate);
  //           ↑ cleanup: quita el listener cuando el componente se desmonta
}, []);
```

Sin el cleanup, si `AsideLayout` se desmontara y volviera a montarse, habría dos listeners escuchando el mismo evento y se llamaría a `setUser` dos veces.

**Ejemplo 3: limpiar un `setTimeout`**

```jsx
// src/routes/Home.jsx — líneas 56-63
useEffect(() => {
  if (showNotification && !isExiting) {
    const timer = setTimeout(() => {
      handleClose();
    }, 3800);

    return () => clearTimeout(timer); // cancela el timer si el estado cambia antes
  }
}, [showNotification, isExiting]);
```

Si el usuario cierra la notificación manualmente antes de los 3.8s, el `clearTimeout` cancela el timer automático.

---

### `useEffect` en el `DataProvider` — reaccionar a la autenticación

```jsx
// src/providers/DataProvider.jsx — líneas 287-302
useEffect(() => {
  setIsInitialized(false);

  if (isAuthenticated) {
    fetchPosts();
    fetchFollowedPosts();
    fetchRecommendedUsers();
  } else {
    setPosts([]);
    setFollowedPosts([]);
    setRecommendedUsers([]);
    setFollows([]);
    setComments([]);
  }
}, [isAuthenticated]);
```

**¿Qué hace?** Cada vez que `isAuthenticated` cambia (login → true, logout → false), este efecto:
- Si acaba de autenticarse → carga los datos.
- Si acaba de cerrar sesión → vacía todos los datos (por privacidad).

---

### `useEffect` para desplazamiento al cambiar de página

```jsx
// src/routes/PostPage.jsx — líneas 32-34
useEffect(() => {
  window.scrollTo(0, 0);
}, [id]);
```

Cada vez que cambia el `id` del post en la URL, la página hace scroll al inicio. Sin esto, si llegas a un post con scroll por la mitad, el siguiente post aparecería también con scroll a medias.

---

### `useEffect` en `AuthProvider` — persistir autenticación en localStorage

```jsx
// src/auth/AuthProvider.jsx — líneas 13-15
useEffect(() => {
  localStorage.setItem("auth", isAuthenticated);
}, [isAuthenticated]);
```

Cada vez que `isAuthenticated` cambia, guarda el nuevo valor en `localStorage`. Así si el usuario recarga la página, el estado de autenticación persiste.

---

## 2. `useRef`: referencias sin re-render

### ¿Qué es?

`useRef` crea un objeto con una propiedad `.current` que **persiste entre renders** pero cuyo cambio **no provoca re-render**. Es diferente a `useState`.

```jsx
const miRef = useRef(valorInicial);
// miRef.current === valorInicial

miRef.current = "nuevo valor"; // ← esto NO provoca re-render
```

### ¿Para qué se usa?

1. **Guardar una bandera de control** (ej: "¿está procesándose una acción?")
2. **Referenciar un elemento del DOM** directamente
3. **Guardar el valor anterior** de algún estado

---

### Ejemplo real: bandera `isTogglingFollow`

```jsx
// src/providers/DataProvider.jsx — línea 38
const isTogglingFollow = useRef(false);

async function toggleFollow(userId) {
  if (!user || isTogglingFollow.current) return; // ← si ya está procesando, salir
  isTogglingFollow.current = true;               // ← bloquea

  // ... lógica de follow/unfollow ...

  try {
    await fetch(...);
  } finally {
    isTogglingFollow.current = false;            // ← desbloquea
  }
}
```

**¿Por qué `useRef` y no `useState`?**

Si usáramos `const [isToggling, setIsToggling] = useState(false)`, cada vez que lo actualizáramos provocaría un **re-render** del `DataProvider` y todos sus hijos. Eso no queremos: simplemente necesitamos una bandera para evitar que `toggleFollow` se llame dos veces a la vez. `useRef` es perfecto para esto.

**El mismo patrón en `PostLikeButton.jsx`:**

```jsx
// src/components/post/PostLikeButton.jsx — línea 16
const isTogglingLike = useRef(false);

async function handleLike() {
  if (!currentUser.id || !token || isTogglingLike.current) return;
  isTogglingLike.current = true;

  // ... lógica del like ...

  finally {
    isTogglingLike.current = false;
    setIsLoading(false);
  }
}
```

Este patrón previene **doble-click**: si el usuario pulsa el botón de like dos veces muy rápido, la segunda llamada verá `isTogglingLike.current === true` y saldrá inmediatamente.

---

## 3. Context API y `useContext`

### El problema: prop drilling

Imagina que tienes datos del usuario autenticado y necesitas mostrarlos en `AsideLayout`, en `UserCardComponent`, en `PostLikeButton`... Tendrías que pasar la prop `user` por **todos los niveles** del árbol:

```
App → Home → AsideLayout → UserCard → Avatar   (user)
App → Home → Feed → PostCard → LikeButton      (user)
```

Esto se llama **prop drilling** y se vuelve un infierno de mantener.

### La solución: Context

La **Context API** de React permite crear un "canal" de datos que cualquier componente del árbol puede leer **sin que se lo pasen los padres**:

```
AuthContext.Provider (en la raíz)
  ├── AsideLayout → usa useAuth() → obtiene user directamente
  ├── Feed
  │     └── PostCard
  │           └── LikeButton → usa useAuth() → obtiene user directamente
  └── ... cualquier componente del árbol
```

### Los 3 pasos para usar Context

**Paso 1: Crear el contexto**

```jsx
import { createContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});
```

El valor que le pasas a `createContext` es el valor por defecto (cuando no hay Provider). En producción siempre habrá un Provider, así que este valor es más de "documentación".

**Paso 2: Crear el Provider**

```jsx
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(...);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Paso 3: Consumir el contexto con `useContext`**

```jsx
export function useAuth() {
  return useContext(AuthContext);
}

// En cualquier componente:
const { isAuthenticated } = useAuth();
```

---

## 4. Cómo se construye un Provider en RythMe

El patrón que siguen los tres providers del proyecto es siempre el mismo:

```
1. createContext()                    ← crea el canal
2. function Provider({ children })   ← crea el componente que envuelve
3. useState / useEffect / useRef      ← la lógica interna
4. <Context.Provider value={...}>     ← publica los datos al árbol
5. export function useX()             ← hook de conveniencia para consumir
```

---

## 5. `AuthProvider`: autenticación global

**Archivo**: `src/auth/AuthProvider.jsx`

```jsx
import { useContext, createContext, useState, useEffect } from "react";

// Paso 1: crear el contexto
const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

// Paso 2: el Provider
export function AuthProvider({ children }) {
  // Lee de localStorage para persistir el login entre recargas
  const savedAuth = localStorage.getItem("auth");
  const [isAuthenticated, setIsAuthenticated] = useState(savedAuth === "true");

  // Efecto: persiste el valor en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("auth", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Paso 3: hook de conveniencia
export function useAuth() {
  return useContext(AuthContext);
}
```

### ¿Dónde se usa?

En `main.jsx`, `AuthProvider` envuelve **toda la app**. Eso significa que cualquier componente puede llamar a `useAuth()` y obtener `isAuthenticated` y `setIsAuthenticated`:

```jsx
// src/auth/AuthProvider.jsx se usa en:

// ProtectedRoute.jsx — redirige si no está autenticado
const { isAuthenticated } = useAuth();
if (!isAuthenticated) return <Navigate to="/login" replace />;

// PublicRoute.jsx — redirige al feed si ya está autenticado
const { isAuthenticated } = useAuth();
if (isAuthenticated) return <Navigate to="/" replace />;

// Login.jsx — marca como autenticado tras login exitoso
auth.setIsAuthenticated(true);

// AsideLayout.jsx — logout
auth.setIsAuthenticated(false);

// DataProvider.jsx — sabe cuándo cargar/limpiar datos
const { isAuthenticated } = useAuth();
useEffect(() => { ... }, [isAuthenticated]);
```

---

## 6. `PostProvider`: estado local de un post

**Archivo**: `src/providers/PostProvider.jsx`

```jsx
const PostContext = createContext(null);

export function PostProvider({ post, children, onUpdate }) {
  // Copia local del post — independiente del prop original
  const [currentPost, setCurrentPost] = useState(post);

  // Si el prop `post` cambia desde fuera, sincroniza el estado interno
  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  // Función para actualizar el post — fusiona datos y notifica al padre
  const updatePost = (updatedData) => {
    const newData = { ...currentPost, ...updatedData };
    setCurrentPost(newData);
    if (onUpdate) onUpdate(newData);  // callback al padre (DataProvider)
  };

  return (
    <PostContext.Provider value={{ post: currentPost, updatePost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  return useContext(PostContext);
}
```

### ¿Por qué existe `PostProvider`?

Sin él, `PostLikeButton` y `PostCommentButton` tendrían que recibir el post y las funciones de actualización como props:

```jsx
// Sin PostProvider (prop drilling):
<PostCardComponent post={post}>
  <PostLikeButton post={post} onUpdate={updatePost} /> // ← pasando props manualmente
  <PostCommentButton post={post} onUpdate={updatePost} />
</PostCardComponent>
```

Con `PostProvider`, los botones solo usan `usePostContext()`:

```jsx
// Con PostProvider:
<PostProvider post={post} onUpdate={updatePost}>
  <div className="rating-card">
    ...
    <PostLikeButton />       {/* no necesita props */}
    <PostCommentButton />    {/* no necesita props */}
  </div>
</PostProvider>
```

Y en `PostLikeButton`:

```jsx
// src/components/post/PostLikeButton.jsx — línea 12
const { post, updatePost } = usePostContext();
```

### La cadena de actualización

Cuando el usuario da like, ocurre esta cadena:

```
PostLikeButton
  → updatePost({ is_liked: true, count_likes: 5 })      [PostContext]
      → setCurrentPost(newData)                           [PostProvider state]
      → onUpdate(newData)                                 [callback al padre]
          → updatePost() del DataProvider                 [DataContext]
              → setPosts(prev => prev.map(...))           [actualiza la lista global]
```

Así, un like en un post actualiza tanto:
1. El estado local del `PostProvider` (para re-renderizar la tarjeta inmediatamente).
2. El estado global del `DataProvider` (para que otras partes de la app que usen `posts` también estén actualizadas).

### El `useEffect` de sincronización en `PostProvider`

```jsx
useEffect(() => {
  setCurrentPost(post);
}, [post]);
```

¿Por qué? Cuando el `DataProvider` actualiza su lista de posts, los componentes que usan `posts` del contexto se re-renderizarán con el nuevo objeto `post`. Ese nuevo objeto llega como prop al `PostProvider`. Sin este efecto, el estado interno (`currentPost`) seguiría teniendo el valor viejo.

---

## 7. `DataProvider`: el cerebro de la app

**Archivo**: `src/providers/DataProvider.jsx`

Este es el provider más complejo. Gestiona todos los datos de la aplicación: posts, posts de seguidos, posts de música, comentarios, usuarios recomendados, follows.

### El estado que gestiona

```jsx
// src/providers/DataProvider.jsx — líneas 17-36
const [posts, setPosts] = useState([]);                    // feed principal
const [nextPageUrl, setNextPageUrl] = useState(null);      // paginación

const [followedPosts, setFollowedPosts] = useState([]);    // feed de seguidos
const [nextFollowedPageUrl, setNextFollowedPageUrl] = useState(null);

const [recommendedUsers, setRecommendedUsers] = useState([]); // sugerencias de usuarios
const [follows, setFollows] = useState([]);                // IDs de usuarios seguidos

const [comments, setComments] = useState([]);              // comentarios del post abierto
const [nextCommentPageUrl, setNextCommentPageUrl] = useState(null);
const [loadingComments, setLoadingComments] = useState(false);

const [isInitialized, setIsInitialized] = useState(false); // ¿ya cargó la primera vez?
const [loadingPosts, setLoadingPosts] = useState(false);
// ...

const isTogglingFollow = useRef(false);                    // bandera anti-doble-click
```

### Paginación infinita con `nextPageUrl`

```jsx
async function fetchPosts(url = getApi() + "/posts") {
  setLoadingPosts(true);
  try {
    const response = await fetch(url, { headers: getAuthHeaders() });
    const data = await response.json();
    const newPosts = extractList(data);
    const nextUrl = data.links?.next ?? null; // ← URL de la siguiente página o null

    setNextPageUrl(nextUrl);

    const isFirstPage = url === getApi() + "/posts";
    if (isFirstPage) {
      setPosts(newPosts);                              // primera carga: reemplaza
    } else {
      setPosts((prev) => [...prev, ...newPosts]);      // más páginas: acumula
    }
    setIsInitialized(true);
  } catch {
    setError("No se pudieron cargar los posts :(");
  } finally {
    setLoadingPosts(false);
  }
}

async function loadMorePosts() {
  if (nextPageUrl && !loadingPosts) {
    await fetchPosts(nextPageUrl); // ← carga la siguiente página
  }
}
```

El componente del feed llama a `loadMorePosts()` cuando el scroll llega al final, creando el efecto de **scroll infinito**.

### `updatePost`: actualización optimista

```jsx
// src/providers/DataProvider.jsx — líneas 190-200
function updatePost(updatedPost) {
  setPosts((prev) =>
    prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
  );
  setFollowedPosts((prev) =>
    prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
  );
  setMusicPosts((prev) =>
    prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
  );
}
```

Cuando alguien da like a un post, esta función:
1. Busca el post por su `id` en las tres listas.
2. Lo reemplaza por la versión actualizada.
3. Deja todos los demás intactos.

El patrón `array.map()` devuelve **un nuevo array** (no muta el original), que es lo correcto en React.

### `toggleFollow`: actualización optimista con rollback

Esta función implementa el patrón de **actualización optimista**: actualiza la UI inmediatamente sin esperar la respuesta del servidor. Si el servidor falla, revierte el cambio:

```jsx
// src/providers/DataProvider.jsx — líneas 208-285
async function toggleFollow(userId) {
  if (!user || isTogglingFollow.current) return;
  isTogglingFollow.current = true;

  const isFollowing = follows.includes(userId);

  // 1. OPTIMISTIC UPDATE: actualiza UI inmediatamente
  if (isFollowing) {
    setFollows((prev) => prev.filter((id) => id !== userId));
    setFollowedPosts((prev) =>
      prev.filter((post) => String(post.user_id) !== String(userId)),
    );
  } else {
    setFollows((prev) => [...prev, userId]);
  }

  try {
    // 2. Llama al servidor
    const method = isFollowing ? "DELETE" : "POST";
    const response = await fetch(getApi() + "/follows", { method, ... });

    if (!response.ok) throw new Error("Failed to toggle follow");

    // 3. Si todo fue bien, carga los posts del nuevo seguido
    if (!isFollowing) {
      // fetchPosts del usuario recién seguido...
    }
  } catch (err) {
    // 4. ROLLBACK: si el servidor falla, revierte el cambio
    setFollows(
      isFollowing
        ? [...follows, userId]       // vuelve a añadir si era seguido
        : follows.filter((id) => id !== userId), // vuelve a quitar si no lo era
    );
  } finally {
    isTogglingFollow.current = false;
  }
}
```

### `Promise.all`: peticiones en paralelo

```jsx
// src/providers/DataProvider.jsx — líneas 165-170
const [usersRes, followsRes] = await Promise.all([
  fetch(getApi() + "/users", { headers: getAuthHeaders() }),
  fetch(getApi() + "/follows/" + user.id, { headers: getAuthHeaders() }),
]);
```

`Promise.all` lanza las dos peticiones **en paralelo** en lugar de esperar a que acabe una para empezar la otra. Si cada petición tarda 300ms, con `Promise.all` tardamos ~300ms en total en lugar de ~600ms.

### El valor del contexto que expone `DataProvider`

```jsx
// src/providers/DataProvider.jsx — líneas 305-343
<DataContext.Provider
  value={{
    posts,                    // lista de posts del feed
    followedPosts,            // lista de posts de seguidos
    recommendedUsers,         // usuarios sugeridos para seguir
    follows,                  // array de IDs de usuarios que sigo
    isInitialized,            // ¿ya cargó la primera vez?
    loadingPosts,             // boolean de carga
    loadingFollowedPosts,
    loadingUsers,
    error,
    updatePost,               // función para actualizar un post en las listas
    updateComment,            // función para actualizar un comentario
    toggleFollow,             // función para seguir/dejar de seguir
    hasMorePages,             // ¿hay más páginas de posts?
    hasMoreFollowedPages,
    loadMorePosts,            // cargar siguiente página
    loadMoreFollowedPosts,
    refreshPosts,             // recargar desde la primera página
    refreshFollowedPosts,
    refreshAll,               // recargar todo
    comments,
    loadingComments,
    hasMoreComments,
    fetchComments,
    loadMoreComments,
    resetComments,
    musicPosts,
    loadingMusicPosts,
    fetchMusicPosts,
  }}
>
  {children}
</DataContext.Provider>
```

Cualquier componente que llame a `useData()` tiene acceso a todo esto sin necesidad de props.

---

## ✅ Resumen de la Parte 2

| Concepto | Qué hace | Dónde en RythMe |
|---|---|---|
| **`useEffect(fn, [])`** | Se ejecuta una vez al montar | `ApplicationComponent` — carga estado inicial |
| **`useEffect(fn, [dep])`** | Se ejecuta cuando cambia la dependencia | `ProfilePage` — recarga al cambiar username |
| **`useEffect` cleanup** | Se ejecuta al desmontar o antes de re-ejecutar | `ProfilePage` AbortController, `Home` clearTimeout |
| **`useRef`** | Valor persistente sin re-render | `isTogglingFollow`, `isTogglingLike` — flags anti-doble-click |
| **Context API** | Datos globales sin prop drilling | `AuthContext`, `DataContext`, `PostContext` |
| **`createContext`** | Crea el canal de datos | Los tres providers |
| **`Context.Provider`** | Publica los datos al árbol | Los tres providers |
| **`useContext`** | Consume el contexto | Dentro de `useAuth()`, `useData()`, `usePostContext()` |
| **Provider wrapper** | Envuelve hijos con acceso al contexto | `<AuthProvider>`, `<DataProvider>`, `<PostProvider>` |
| **Lazy init en useState** | Función como valor inicial (solo se evalúa una vez) | `AsideLayout`, `ProfilePage`, `PostPage` |
| **Actualización optimista** | Actualiza UI antes de esperar al servidor | `toggleFollow`, `handleLike` |
| **Rollback** | Revierte si el servidor falla | `toggleFollow` en catch |
| **`Promise.all`** | Peticiones en paralelo | `fetchRecommendedUsers` |

---

➡️ **Continúa en [Parte 3: React Router, Patrones avanzados y Flujo global](./REACT_PARTE3_ROUTER_Y_PATRONES.md)**
