import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { getApi } from "../config";

const DataContext = createContext();

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

    const [isInitialized, setIsInitialized] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingFollowedPosts, setLoadingFollowedPosts] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [error, setError] = useState(null);

    const isTogglingFollow = useRef(false);

    function getAuthHeaders() {
        const token = localStorage.getItem("token");
        return { Authorization: "Bearer " + token };
    }

    async function fetchPosts(url = getApi() + "/posts") {
        setLoadingPosts(true);
        try {
            const response = await fetch(url, { headers: getAuthHeaders() });
            const data = await response.json();
            const newPosts = extractList(data);
            const nextUrl = data.links?.next ?? null;

            setNextPageUrl(nextUrl);

            const isFirstPage = url === getApi() + "/posts";
            if (isFirstPage) {
                setPosts(newPosts);
            } else {
                setPosts((prev) => [...prev, ...newPosts]);
            }

            setIsInitialized(true);
        } catch (err) {
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
        } catch (err) {
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

    async function fetchRecommendedUsers() {
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        if (!user) return;

        setLoadingUsers(true);
        try {
            // Usamos Promise.all para cargar usuarios y seguidos al mismo tiempo (mas rapido)
            const [usersRes, followsRes] = await Promise.all([
                fetch(getApi() + "/users", { headers: getAuthHeaders() }),
                fetch(getApi() + "/follows/" + user.id, { headers: getAuthHeaders() })
            ]);

            const allUsers = extractList(await usersRes.json());
            const followedData = extractList(await followsRes.json());
            const followedIds = followedData.map((f) => f.id);

            setFollows(followedIds);

            // Filtramos para no recomendarnos a nosotros mismos ni a gente que ya seguimos
            const recommendations = allUsers
                .filter((u) => u.id !== user.id && !followedIds.includes(u.id))
                .slice(0, 3);

            setRecommendedUsers(recommendations);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingUsers(false);
        }
    }

    function updatePost(updatedPost) {
        // Actualizamos el post en la lista general
        setPosts((prev) =>
            prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
        );
        // Tambien lo actualizamos en la lista de seguidos para que esten sincronizados
        setFollowedPosts((prev) =>
            prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
        );
    }

    async function toggleFollow(userId) {
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        if (!user || isTogglingFollow.current) return;
        isTogglingFollow.current = true;

        const isFollowing = follows.includes(userId);

        if (isFollowing) {
            setFollows((prev) => prev.filter((id) => id !== userId));
            setFollowedPosts((prev) => prev.filter((post) => String(post.user_id) !== String(userId)));
        } else {
            setFollows((prev) => [...prev, userId]);
        }

        try {
            const method = isFollowing ? "DELETE" : "POST";
            await fetch(getApi() + "/follows", {
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

            if (!isFollowing) {
                setLoadingFollowedPosts(true);
                const response = await fetch(getApi() + "/posts/followed", { headers: getAuthHeaders() });
                const incoming = extractList(await response.json());
                const newUserPosts = incoming.filter((post) => String(post.user_id) === String(userId));

                if (newUserPosts.length > 0) {
                    setFollowedPosts((prev) => {
                        const existingIds = new Set(prev.map((post) => post.id));
                        const toAdd = newUserPosts.filter((post) => !existingIds.has(post.id));
                        return [...toAdd, ...prev].sort(
                            (a, b) => new Date(b.created_at) - new Date(a.created_at),
                        );
                    });
                }

                setLoadingFollowedPosts(false);
            }
        } catch (err) {
            console.error(err);
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
        }
    }, [isAuthenticated]);

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
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
