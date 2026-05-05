# 📘 Guía React para RythMe — Parte 1: Fundamentos y `useState`

> Esta guía está escrita específicamente para el proyecto **RythMe**. Todos los ejemplos son del código real del proyecto. Si eres junior y quieres entender qué hace cada cosa y por qué, este es tu punto de partida.
>
> 👉 **Partes de esta guía:**
> - **Parte 1** ← estás aquí — Fundamentos, JSX, Componentes, Props, `useState`
> - **Parte 2** — `useEffect`, `useRef`, `useContext`, Providers
> - **Parte 3** — React Router (hooks de navegación), Patrones avanzados, Flujo global de la app

---

## 📚 Índice

1. [¿Qué es React?](#1-qué-es-react)
2. [JSX: mezclar HTML y JavaScript](#2-jsx-mezclar-html-y-javascript)
3. [Componentes: la unidad de React](#3-componentes-la-unidad-de-react)
4. [Props: pasar datos entre componentes](#4-props-pasar-datos-entre-componentes)
5. [Estado local con `useState`](#5-estado-local-con-usestate)
6. [Renderizado condicional](#6-renderizado-condicional)
7. [Listas y la prop `key`](#7-listas-y-la-prop-key)
8. [Manejo de eventos](#8-manejo-de-eventos)

---

## 1. ¿Qué es React?

React es una **biblioteca de JavaScript** para construir interfaces de usuario. En lugar de manipular el DOM directamente (como harías con `document.getElementById(...).innerHTML = ...`), en React describes **cómo debería verse** la UI y React se encarga de actualizar el DOM de forma eficiente cuando los datos cambian.

### La idea central: el árbol de componentes

Tu aplicación es un árbol de **componentes**. Cada componente es una función que devuelve HTML (llamado JSX). Cuando el estado de un componente cambia, React re-renderiza **solo** ese componente y sus hijos, no toda la página.

```
AuthProvider
  └── DataProvider
        └── RouterProvider
              └── ProtectedRoute
                    └── Home
                          ├── AsideLayout
                          ├── main > <Outlet> (Feed, ProfilePage, MusicPage, ...)
                          └── RightAsideLayout
```

Este es exactamente el árbol que tiene **RythMe** (ver `src/main.jsx`).

---

## 2. JSX: mezclar HTML y JavaScript

JSX es la sintaxis que parece HTML pero en realidad es JavaScript. Cuando escribes esto:

```jsx
return <h1>Hola, {user.name}!</h1>;
```

React lo convierte internamente en:

```js
return React.createElement('h1', null, 'Hola, ', user.name, '!');
```

### Reglas importantes de JSX

**1. Un solo elemento raíz por `return`.**  
Si necesitas devolver varios elementos sin añadir un `<div>` extra, usa un fragmento `<>...</>`:

```jsx
// ❌ Esto falla — dos elementos raíz
return (
  <h1>Título</h1>
  <p>Párrafo</p>
);

// ✅ Con fragmento vacío
return (
  <>
    <h1>Título</h1>
    <p>Párrafo</p>
  </>
);
```

En el proyecto esto se usa en muchos sitios. Por ejemplo en `PostPage.jsx`:

```jsx
// src/routes/PostPage.jsx — líneas 83 y 121
return (
  <>
    <div style={{ display: "flex", ... }}>
      <button ...>...</button>
      <h2 ...>Post</h2>
    </div>
    {post && (
      <>
        <PostCardComponent post={post} type="fromPost" />
        <h3 ...>Comentarios ({post.count_comments || 0})</h3>
        <CommentComponent postId={id} />
      </>
    )}
  </>
);
```

**2. Las expresiones JavaScript van entre llaves `{}`.**

```jsx
// src/components/post/PostCardComponent.jsx — línea 105
<div className="user-name">
  {fullName}
  <VerifiedBadgeComponent type={post.user_type || post.type} />
</div>
```

`{fullName}` evalúa la variable. `{post.user_type || post.type}` evalúa la expresión JavaScript.

**3. `className` en lugar de `class`.**  
Porque `class` es una palabra reservada en JavaScript:

```jsx
// ✅ Correcto en JSX
<div className="rating-card">

// ❌ class es palabra reservada
<div class="rating-card">
```

**4. Los atributos de evento son camelCase.**

```jsx
// En HTML normal escribirías: onclick="..."
// En JSX es:
<button onClick={handleLike}>Like</button>
<input onChange={(e) => setUsername(e.target.value)} />
```

---

## 3. Componentes: la unidad de React

Un componente es simplemente **una función que devuelve JSX**. En RythMe todos los componentes son funciones (no clases).

### Anatomía de un componente

```jsx
// src/components/post/PostCardComponent.jsx

// 1. Imports
import { useNavigate } from "react-router-dom";
import { useData } from "../../providers/DataProvider";

// 2. Función (el componente)
export default function PostCardComponent({ post, type = "post" }) {
  // 3. Hooks y lógica
  const { updatePost } = useData();
  const navigate = useNavigate();

  // 4. Funciones auxiliares
  function redirectToPost() { ... }

  // 5. JSX devuelto
  return (
    <PostProvider post={post} onUpdate={updatePost}>
      <div className="rating-card" onClick={redirectToPost}>
        ...
      </div>
    </PostProvider>
  );
}
```

### `export default`

Cada archivo de componente exporta su componente como `export default`. Eso significa que cuando lo importas, le puedes dar el nombre que quieras:

```jsx
// Importación — el nombre que uses es libre
import PostCardComponent from "../components/post/PostCardComponent";
import MiNombreQueQuiera from "../components/post/PostCardComponent"; // también funciona
```

---

## 4. Props: pasar datos entre componentes

Las **props** (propiedades) son la manera de pasar datos **de padre a hijo**. Son como los parámetros de una función.

### Sintaxis básica

```jsx
// Padre pasa datos:
<PostCardComponent post={post} type="fromPost" />

// Hijo los recibe como parámetro del objeto props:
function PostCardComponent({ post, type }) {
  // aquí puedes usar post y type
}
```

La desestructuración `{ post, type }` es equivalente a escribir `props.post` y `props.type`.

### Props con valor por defecto

```jsx
// src/components/post/PostCardComponent.jsx — línea 8
export default function PostCardComponent({ post, type = "post" }) {
```

Si el padre no pasa `type`, el componente usará `"post"` como valor por defecto. Esto evita tener que hacer comprobaciones adicionales.

### Ejemplo real: pasando datos del perfil

En `ProfilePage.jsx` se pasa el usuario a varios componentes hijo:

```jsx
// src/routes/ProfilePage.jsx — líneas 203-208
<UserCardComponent user={user} onFollowChange={handleFollowChange} />

<UserNavigationComponent
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

- `user` es un **objeto** con los datos del usuario.
- `onFollowChange` es una **función** que el hijo puede llamar para notificar al padre.
- `activeTab` es un **string** con la pestaña activa.
- `onTabChange` es la función `setActiveTab` del estado del padre — así el hijo puede cambiar el estado del padre.

> 💡 **Patrón importante**: pasar una función como prop es la manera de que un **hijo comunique algo al padre**. El hijo llama a la función, el padre reacciona.

### Props especial: `children`

Cuando escribes JSX entre las etiquetas de apertura y cierre de un componente, ese contenido llega como la prop `children`:

```jsx
// Uso:
<PostProvider post={post} onUpdate={updatePost}>
  <div className="rating-card">...</div>   {/* esto es children */}
</PostProvider>

// Dentro de PostProvider:
export function PostProvider({ post, children, onUpdate }) {
  return (
    <PostContext.Provider value={{ post: currentPost, updatePost }}>
      {children}  {/* renderiza lo que le pasaron entre etiquetas */}
    </PostContext.Provider>
  );
}
```

---

## 5. Estado local con `useState`

El **estado** es la memoria interna de un componente. Cuando el estado cambia, React vuelve a renderizar el componente con los nuevos datos.

### Sintaxis

```jsx
import { useState } from "react";

const [valor, setValor] = useState(valorInicial);
```

- `valor` — la variable que puedes leer en el JSX.
- `setValor` — la función que llamas para cambiar el valor.
- `valorInicial` — el valor con el que empieza.

> ⚠️ **Nunca modifiques `valor` directamente** (ej: `valor = "nuevo"`). Siempre usa `setValor("nuevo")`. De lo contrario React no sabrá que ha cambiado y no re-renderizará.

---

### Ejemplo 1: booleano — mostrar/ocultar el menú de logout

```jsx
// src/layout/AsideLayout.jsx — línea 12
const [showLogout, setShowLogout] = useState(false);
```

- **Tipo**: `boolean` — empieza en `false` (menú oculto).
- **Cuándo cambia**: al hacer click en la tarjeta del usuario.

```jsx
// Línea 121 — el click alterna entre true y false
<div className="user-card" onClick={() => setShowLogout((prev) => !prev)}>
```

`(prev) => !prev` es el patrón de **actualización funcional**: React te pasa el valor anterior (`prev`) y tú devuelves el nuevo. Se usa cuando el nuevo valor depende del anterior.

```jsx
// Línea 141 — solo se renderiza cuando showLogout es true
{showLogout && (
  <button onClick={handleLogout} className="nav-item action-btn logout-btn">
    <span className="material-symbols-outlined">logout</span>
    Cerrar sesión
  </button>
)}
```

---

### Ejemplo 2: múltiples estados — página de Login

```jsx
// src/routes/Login.jsx — líneas 11-14
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);
```

Cada `useState` es independiente. Aquí hay 4 piezas de estado:
- `username` y `password` — controlan los inputs del formulario.
- `error` — guarda el mensaje de error si el login falla.
- `isLoading` — muestra la pantalla de carga mientras se llama a la API.

Los inputs usan un patrón llamado **controlled component**: el valor del input siempre refleja el estado, y cada pulsación de tecla actualiza el estado:

```jsx
// Líneas 77-82
<input
  type="text"
  placeholder="Nombre de usuario"
  value={username}                              // <-- controlado por el estado
  onChange={(e) => setUsername(e.target.value)} // <-- actualiza el estado
/>
```

---

### Ejemplo 3: estado con valor inicial calculado — `lazy initializer`

A veces el valor inicial requiere un cálculo o leer de `localStorage`. En lugar de hacerlo en cada render, puedes pasar una **función** como valor inicial (solo se ejecuta una vez):

```jsx
// src/layout/AsideLayout.jsx — líneas 16-19
const [user, setUser] = useState(() => {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : {};
});
```

¿Por qué la función? Si escribieras `useState(JSON.parse(localStorage.getItem("user")))`, ese cálculo se ejecutaría **en cada re-render** aunque solo se use para el valor inicial. Con la función solo se ejecuta la primera vez.

El mismo patrón se usa en `ProfilePage.jsx` para cargar los datos del usuario desde `location.state` o `localStorage`:

```jsx
// src/routes/ProfilePage.jsx — líneas 23-38
const [user, setUser] = useState(() => {
  if (location.state && location.state.username === username) {
    return {
      id: location.state.user_id || location.state.id || "",
      name: location.state.name || "",
      // ...
    };
  }
  const storedUser = userJson ? JSON.parse(userJson) : {};
  return username === storedUser.username ? storedUser : { username };
});
```

---

### Ejemplo 4: actualizar estado basado en el estado anterior

En `DataProvider.jsx` la lista de posts se acumula página a página. El nuevo estado depende del estado anterior:

```jsx
// src/providers/DataProvider.jsx — línea 59
setPosts((prev) => [...prev, ...newPosts]);
```

`prev` es el array anterior de posts. Con el spread operator `...` creamos un **nuevo array** que contiene los anteriores más los nuevos. Esto es correcto porque:

1. **Inmutabilidad**: en React nunca mutes arrays u objetos directamente. Crea siempre copias.
2. **La función de actualización** garantiza que usas el valor más reciente aunque haya múltiples actualizaciones pendientes.

---

### Ejemplo 5: estado para animaciones

```jsx
// src/components/post/PostLikeButton.jsx — líneas 17-18
const [isLoading, setIsLoading] = useState(false);
const [isAnimating, setIsAnimating] = useState(false);
```

Cuando el usuario da like, `isAnimating` se pone a `true` y una animación CSS se activa. Después de 600ms vuelve a `false`:

```jsx
// Líneas 31-34
if (willBeLiked) {
  setIsAnimating(true);
  setTimeout(() => setIsAnimating(false), 600);
}
```

Y en el JSX, la clase CSS cambia dinámicamente:

```jsx
// Líneas 77-80
let animatingClass = "like-icon-container";
if (isAnimating) {
  animatingClass += " animating";
}
```

---

### Ejemplo 6: actualizar un objeto en el estado

Cuando el estado es un objeto y solo quieres cambiar alguna propiedad, usa el spread operator para **copiar el objeto** y sobrescribir solo lo que cambia:

```jsx
// src/routes/ProfilePage.jsx — líneas 173-180
const handleFollowChange = (nextFollowingState) => {
  setUser((prev) => ({
    ...prev,                     // copia todas las propiedades anteriores
    followers: nextFollowingState  // sobrescribe solo esta
      ? (parseInt(prev.followers) || 0) + 1
      : (parseInt(prev.followers) || 0) - 1,
  }));
};
```

---

## 6. Renderizado condicional

En React puedes decidir qué renderizar según el estado usando varias técnicas:

### Operador ternario `? :`

```jsx
// src/routes/ApplicationComponent.jsx — líneas 55-60
if (user && user.type !== "user") return <ApplicationAccepted user={user} />;
if (isLoading) return <LoaderScreen text="Comprobando solicitudes... " inline={true} />;

return hasApplication ? <ApplicationPending /> : <ApplicationStart />;
```

Primero se hacen comprobaciones como early returns (retornos tempranos). Al final, si llegamos a ese punto, el ternario decide qué mostrar.

### Cortocircuito `&&`

```jsx
// src/layout/AsideLayout.jsx — líneas 141-149
{showLogout && (
  <button onClick={handleLogout} className="nav-item action-btn logout-btn">
    Cerrar sesión
  </button>
)}
```

`A && B` en JavaScript devuelve `B` si `A` es `true`, o `A` (falsy) si `A` es `false`. React no renderiza `false`, así que si `showLogout` es `false`, no se renderiza nada.

> ⚠️ Cuidado con los números: `{0 && <Componente />}` renderizaría `0` en la pantalla porque `0` es un valor truthy que JSX sí pinta. Mejor usar `{count > 0 && <Componente />}`.

### Operador `||` para valores por defecto

```jsx
// src/components/user/UserCardComponent.jsx — línea 65
<p className="profile-bio">
  {user.bio || "Explorando nuevos ritmos en RythMe."}
</p>
```

Si `user.bio` es `null`, `undefined` o `""`, se muestra el texto por defecto.

---

## 7. Listas y la prop `key`

Para renderizar una lista de elementos, usa `.map()`:

```jsx
// src/routes/MusicPage.jsx — líneas 134-136
musicPosts.map((post) => (
  <PostCardComponent key={post.id} post={post} />
))
```

**La prop `key` es obligatoria** cuando renderizas listas. React la usa internamente para saber qué elemento cambió cuando la lista se actualiza. Debe ser **única** dentro de la lista y **estable** (no uses el índice del array si los elementos se pueden reordenar).

```jsx
// ✅ Bueno — usa el ID único de la base de datos
musicPosts.map((post) => <PostCardComponent key={post.id} post={post} />)

// ⚠️ Malo — el índice cambia cuando se reordena la lista
musicPosts.map((post, index) => <PostCardComponent key={index} post={post} />)
```

---

## 8. Manejo de eventos

### Pasar funciones como handlers

```jsx
// Correcto: pasas la referencia a la función
<button onClick={handleLogout}>Cerrar sesión</button>

// También correcto: función anónima inline
<button onClick={() => setShowLogout(false)}>Cerrar</button>

// ❌ Incorrecto: la llamas inmediatamente al renderizar
<button onClick={handleLogout()}>Cerrar sesión</button>
```

### Recibir el objeto evento `e`

Los handlers reciben el objeto evento como primer argumento:

```jsx
// src/routes/Login.jsx — línea 19
const handleSubmit = async (e) => {
  e.preventDefault(); // evita que el formulario recargue la página
  // ...
};
```

### `stopPropagation`: detener la burbuja de eventos

Los eventos en el DOM "burbujean" hacia arriba: si clicas en un elemento hijo, el padre también recibe el evento. En `PostCardComponent.jsx` hay elementos anidables con distintos destinos de navegación:

```jsx
// src/components/post/PostCardComponent.jsx

// El contenedor padre navega al post
<div className="rating-card" onClick={redirectToPost}>

  // El bloque de usuario navega al perfil
  <div className="rating-header" onClick={redirectToProfile}>
    ...
  </div>

  // El bloque de música navega a la canción
  <div className="song-block" onClick={redirectToMusic}>
    ...
  </div>

</div>
```

Sin `stopPropagation`, al clicar en el header del usuario, se activarían tanto `redirectToProfile` como `redirectToPost`. Para evitarlo:

```jsx
// Líneas 24-38
function redirectToProfile(e) {
  e.stopPropagation(); // ← detiene la burbuja: el padre NO recibe el click
  navigate(`/${post.user_name}`, { state: { ... } });
}

function redirectToMusic(e) {
  e.stopPropagation(); // ← idem
  navigate(`/music/${post.music_id}`, { state: { ... } });
}
```

También se usa en las acciones de like/comentar para que el click no propague al contenedor:

```jsx
// Línea 138
<div className="actions" onClick={(e) => e.stopPropagation()}>
  <PostLikeButton />
  <PostCommentButton />
</div>
```

---

## ✅ Resumen de la Parte 1

| Concepto | Qué es | Dónde se usa en RythMe |
|---|---|---|
| **JSX** | HTML+JS mezclado | Todos los componentes |
| **Componente** | Función que devuelve JSX | `PostCardComponent`, `AsideLayout`, etc. |
| **Props** | Datos de padre a hijo | `<PostCardComponent post={post} type="fromPost" />` |
| **`children`** | JSX entre etiquetas de un componente | `PostProvider`, `AuthProvider` |
| **`useState`** | Estado local que re-renderiza al cambiar | Login form, showLogout, isLoading, etc. |
| **Lazy init** | Función como valor inicial de `useState` | `AsideLayout`, `ProfilePage`, `PostPage` |
| **Actualiz. funcional** | `setState(prev => nuevo)` | `setPosts(prev => [...prev, ...newPosts])` |
| **Condicional `&&`** | Renderizar o no | `{showLogout && <button>}` |
| **Ternario `? :`** | Elegir entre dos componentes | `isLoading ? <Loader/> : <Content/>` |
| **`.map()` + `key`** | Listas de elementos | `musicPosts.map(post => <PostCard key={post.id}>)` |
| **`stopPropagation`** | Evitar burbujeo de eventos | `redirectToProfile`, `redirectToMusic` |

---

➡️ **Continúa en [Parte 2: useEffect, useRef, useContext y Providers](./REACT_PARTE2_HOOKS_AVANZADOS.md)**
