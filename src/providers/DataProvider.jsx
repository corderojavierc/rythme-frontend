import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { getApi } from "../config";

const DataContext = createContext();

export function DataProvider({ children }) {
    const { isAuthenticated } = useAuth();

    const [posts, setPosts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [follows, setFollows] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [error, setError] = useState(null);

    async function fetchPosts(url = getApi() + "/posts") {
        setLoadingPosts(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(url, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const data = await response.json();

            const rawPosts = data.data ? data.data : data;
            let newPosts = Array.isArray(rawPosts) ? rawPosts : [];

            const userJson = localStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;

            // Marcar posts como liked si el usuario ha dado like (sincronización manual)
            if (user && token) {
                try {
                    const likesResponse = await fetch(
                        getApi() + "/likes/" + user.id,
                        {
                            headers: { Authorization: "Bearer " + token },
                        },
                    );
                    const likesData = await likesResponse.json();
                    const rawLikes = likesData.data
                        ? likesData.data
                        : likesData;

                    const likedPostIds = Array.isArray(rawLikes)
                        ? rawLikes
                              .filter(
                                  (l) =>
                                      l.type &&
                                      l.type.toLowerCase().includes("post"),
                              )
                              .map((l) => l.id.toString())
                        : [];

                    newPosts = newPosts.map((p) => ({
                        ...p,
                        is_liked: p.is_liked || likedPostIds.includes(p.id.toString()),
                    }));
                } catch (e) {
                    console.error("Error fetching likes:", e);
                }
            }

            if (data.links && data.links.next) {
                setNextPageUrl(data.links.next);
            } else {
                setNextPageUrl(null);
            }

            if (url === getApi() + "/posts") {
                setPosts(newPosts);
            } else {
                setPosts((prev) => [...prev, ...newPosts]);
            }
        } catch (err) {
            setError("No se pudieron cargar los posts :(");
        } finally {
            setLoadingPosts(false);
        }
    }

    async function loadMorePosts() {
        if (nextPageUrl && !loadingPosts) {
            await fetchPosts(nextPageUrl);
        }
    }

    async function fetchRecommendedUsers() {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        if (token && user) {
            setLoadingUsers(true);
            try {
                const usersResponse = await fetch(getApi() + "/users", {
                    headers: { Authorization: "Bearer " + token },
                });
                const usersData = await usersResponse.json();
                const rawUsers = usersData.data ? usersData.data : usersData;
                const allUsers = Array.isArray(rawUsers) ? rawUsers : [];

                const followsResponse = await fetch(
                    getApi() + "/follows/" + user.id,
                    {
                        headers: { Authorization: "Bearer " + token },
                    },
                );
                const followsData = await followsResponse.json();
                const rawFollows = followsData.data
                    ? followsData.data
                    : followsData;
                const userFollows = Array.isArray(rawFollows) ? rawFollows : [];

                const followedIds = userFollows.map((f) => f.id);
                setFollows(followedIds);

                const recommendations = allUsers
                    .filter(
                        (u) => u.id !== user.id && !followedIds.includes(u.id),
                    )
                    .slice(0, 3);

                setRecommendedUsers(recommendations);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingUsers(false);
            }
        }
    }

    function updatePost(updatedPost) {
        setPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
        );
    }

    async function toggleFollow(id) {
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        if (!token || !user) return;

        const isFollowing = follows.includes(id);

        if (isFollowing) {
            setFollows((prev) => prev.filter((userId) => userId !== id));
        } else {
            setFollows((prev) => [...prev, id]);
        }

        try {
            await fetch(getApi() + "/follows", {
                method: isFollowing ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    follower_id: user.id,
                    followed_id: id,
                }),
            });
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (isAuthenticated === true) {
            setLoadingPosts(true);
            setLoadingUsers(true);
            fetchPosts();
            fetchRecommendedUsers();
        } else {
            setPosts([]);
            setRecommendedUsers([]);
            setFollows([]);
        }
    }, [isAuthenticated]);

    return (
        <DataContext.Provider
            value={{
                posts,
                recommendedUsers,
                follows,
                loadingPosts,
                loadingUsers,
                error,
                updatePost,
                toggleFollow,
                hasMorePages: nextPageUrl !== null,
                loadMorePosts,
                refreshAll: () => {
                    fetchPosts();
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
