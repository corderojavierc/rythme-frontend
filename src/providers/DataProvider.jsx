/* eslint-disable react-refresh/only-export-components */
// Contexto global que centraliza posts, usuarios recomendados, follows y comentarios.
// Evita hacer las mismas peticiones a la API desde múltiples componentes
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { getApi, getAuthHeaders, getUser } from "../config";

const DataContext = createContext();

// La API puede devolver { data: [...] } o directamente un array; esto normaliza ambos casos
function extractList(responseData) {
  if (responseData.data) return responseData.data;
  if (Array.isArray(responseData)) return responseData;
  return [];
}

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const [followedPosts, setFollowedPosts] = useState([]);
  const [nextFollowedPageUrl, setNextFollowedPageUrl] = useState(null);

  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [follows, setFollows] = useState([]);

  const [comments, setComments] = useState([]);
  const [nextCommentPageUrl, setNextCommentPageUrl] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingFollowedPosts, setLoadingFollowedPosts] = useState(false);
  const [musicPosts, setMusicPosts] = useState([]);
  const [loadingMusicPosts, setLoadingMusicPosts] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);

  const isTogglingFollow = useRef(false);

  async function fetchPosts(url = getApi() + "/posts") {
    setLoadingPosts(true);
    try {
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      const newPosts = extractList(data);
      // data.links.next contiene la URL de la siguiente página que devuelve Laravel.
      // Si es null, no hay más páginas (scroll infinito terminado).
      const nextUrl = data.links?.next ?? null;

      setNextPageUrl(nextUrl);

      // Si es la primera página, reemplazamos la lista entera (refresco).
      // Si es una página siguiente (scroll infinito), añadimos al final.
      const isFirstPage = url === getApi() + "/posts";
      if (isFirstPage) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setIsInitialized(true);
    } catch {
      setError("No se pudieron cargar los posts :(");
      setIsInitialized(true);
    } finally {
      setLoadingPosts(false);
    }
  }

  async function loadMorePosts() {
    if (nextPageUrl && !loadingPosts) {
      await fetchPosts(nextPageUrl);
    }
  }

  async function fetchFollowedPosts(url = getApi() + "/posts/followed") {
    setLoadingFollowedPosts(true);
    try {
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      const newPosts = extractList(data);
      const nextUrl = data.links?.next ?? null;

      setNextFollowedPageUrl(nextUrl);

      const isFirstPage = url === getApi() + "/posts/followed";
      if (isFirstPage) {
        setFollowedPosts(newPosts);
      } else {
        setFollowedPosts((prev) => [...prev, ...newPosts]);
      }
    } catch {
      setError("No se pudieron cargar los posts :(");
    } finally {
      setLoadingFollowedPosts(false);
    }
  }

  async function loadMoreFollowedPosts() {
    if (nextFollowedPageUrl && !loadingFollowedPosts) {
      await fetchFollowedPosts(nextFollowedPageUrl);
    }
  }

  async function fetchComments(postId, url = null) {
    const fetchUrl = url || getApi() + "/comments/" + postId;
    setLoadingComments(true);
    try {
      const response = await fetch(fetchUrl, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      const newComments = extractList(data);
      const nextUrl = data.links?.next ?? null;

      setNextCommentPageUrl(nextUrl);

      if (!url) {
        setComments(newComments);
      } else {
        setComments((prev) => [...prev, ...newComments]);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  }

  async function loadMoreComments(postId) {
    if (nextCommentPageUrl && !loadingComments) {
      await fetchComments(postId, nextCommentPageUrl);
    }
  }

  async function fetchMusicPosts(musicId) {
    setLoadingMusicPosts(true);
    try {
      const response = await fetch(getApi() + "/music/" + musicId + "/posts", {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setMusicPosts(extractList(data));
    } catch (err) {
      console.error("Error fetching music posts:", err);
    } finally {
      setLoadingMusicPosts(false);
    }
  }

  function resetComments() {
    setComments([]);
    setNextCommentPageUrl(null);
  }

  async function fetchRecommendedUsers() {
    const user = getUser();

    if (!user) return;

    setLoadingUsers(true);
    try {
      const [usersRes, followsRes] = await Promise.all([
        fetch(getApi() + "/users", { headers: getAuthHeaders() }),
        fetch(getApi() + "/follows/" + user.id, {
          headers: getAuthHeaders(),
        }),
      ]);

      const allUsers = extractList(await usersRes.json());
      const followedData = extractList(await followsRes.json());
      const followedIds = followedData.map((f) => f.id);

      setFollows(followedIds);

      const recommendations = allUsers
        .filter((u) => u.id !== user.id && !followedIds.includes(u.id))
        .slice(0, 5);

      setRecommendedUsers(recommendations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  }

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

  function updateComment(updatedComment) {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c)),
    );
  }

  // Sigue/deja de seguir a un usuario con actualización optimista (UI cambia antes de que responda la API)
  async function toggleFollow(userId) {
    const user = getUser();

    // isTogglingFollow.current es una ref (no causa re-render) que actúa como mutex:
    // evita que el usuario haga doble click y mande dos peticiones a la vez.
    if (!user || isTogglingFollow.current) return;
    isTogglingFollow.current = true;

    const isFollowing = follows.includes(userId);

    // Actualización optimista: cambiamos el estado local ANTES de esperar la respuesta de la API.
    // Así el botón cambia al instante y la UX parece más rápida.
    if (isFollowing) {
      setFollows((prev) => prev.filter((id) => id !== userId));
      // Si dejamos de seguir, quitamos sus posts del feed de seguidos
      setFollowedPosts((prev) =>
        prev.filter((post) => String(post.user_id) !== String(userId)),
      );
    } else {
      setFollows((prev) => [...prev, userId]);
    }

    // Actualizamos el contador de "following" del usuario en localStorage para que
    // el perfil muestre el número correcto sin necesidad de volver a pedir el perfil.
    const updatedUser = { ...user };
    updatedUser.following = isFollowing
      ? (parseInt(user.following) || 1) - 1
      : (parseInt(user.following) || 0) + 1;
    localStorage.setItem("user", JSON.stringify(updatedUser));

    try {
      const method = isFollowing ? "DELETE" : "POST";
      const response = await fetch(getApi() + "/follows", {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          follower_id: user.id,
          followed_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle follow");
      }

      // Si acabamos de seguir a alguien, pedimos sus posts y los añadimos al feed
      if (!isFollowing) {
        setLoadingFollowedPosts(true);
        const postsResponse = await fetch(getApi() + "/posts/followed", {
          headers: getAuthHeaders(),
        });
        const incoming = extractList(await postsResponse.json());
        const newUserPosts = incoming.filter(
          (post) => String(post.user_id) === String(userId),
        );

        if (newUserPosts.length > 0) {
          setFollowedPosts((prev) => {
            // Set para buscar en O(1) si ya teníamos ese post (evita duplicados)
            const existingIds = new Set(prev.map((post) => post.id));
            const toAdd = newUserPosts.filter(
              (post) => !existingIds.has(post.id),
            );
            // Añadimos al principio y reordenamos por fecha para mantener el feed cronológico
            return [...toAdd, ...prev].sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at),
            );
          });
        }

        setLoadingFollowedPosts(false);
      }
    } catch (err) {
      // Si la API falla, revertimos el estado optimista para que la UI quede consistente
      console.error(err);
      setFollows(
        isFollowing
          ? [...follows, userId]
          : follows.filter((id) => id !== userId),
      );
      localStorage.setItem("user", JSON.stringify(user));
    } finally {
      isTogglingFollow.current = false;
    }
  }

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

  function resetMusicPosts() {
    setMusicPosts([]);
    setLoadingMusicPosts(true);
  }

  return (
    <DataContext.Provider
      value={{
        posts,
        followedPosts,
        recommendedUsers,
        follows,
        isInitialized,
        loadingPosts,
        loadingFollowedPosts,
        loadingUsers,
        error,
        updatePost,
        updateComment,
        toggleFollow,
        hasMorePages: nextPageUrl !== null,
        hasMoreFollowedPages: nextFollowedPageUrl !== null,
        loadMorePosts,
        loadMoreFollowedPosts,
        refreshPosts: () => fetchPosts(),
        refreshFollowedPosts: () => fetchFollowedPosts(),
        refreshAll: () => {
          fetchPosts();
          fetchFollowedPosts();
          fetchRecommendedUsers();
        },
        comments,
        loadingComments,
        hasMoreComments: nextCommentPageUrl !== null,
        fetchComments,
        loadMoreComments,
        resetComments,
        musicPosts,
        loadingMusicPosts,
        fetchMusicPosts,
        resetMusicPosts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
