import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { getApi } from "../config";

const DataContext = createContext();

export function DataProvider({ children }) {
    const { isAuthenticated } = useAuth();

    const [posts, setPosts] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);

    const [followedPosts, setFollowedPosts] = useState([]);
    const [nextFollowedPageUrl, setNextFollowedPageUrl] = useState(null);

    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [follows, setFollows] = useState([]);

    const [loadingPosts, setLoadingPosts] = useState(false);
    const [loadingFollowedPosts, setLoadingFollowedPosts] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [error, setError] = useState(null);

    async function fetchPosts(url = getApi() + "/posts") {
        setLoadingPosts(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(url, {
                headers: { Authorization: "Bearer " + token },
            });
            const data = await response.json();

            let newPosts = [];
            if (data.data) {
                newPosts = data.data;
            } else if (Array.isArray(data)) {
                newPosts = data;
            }

            const userJson = localStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;

            if (user && token) {
                try {
                    const likesResponse = await fetch(getApi() + "/likes/" + user.id, {
                        headers: { Authorization: "Bearer " + token },
                    });
                    const likesData = await likesResponse.json();

                    let rawLikes = [];
                    if (likesData.data) {
                        rawLikes = likesData.data;
                    } else if (Array.isArray(likesData)) {
                        rawLikes = likesData;
                    }

                    const likedPostIds = rawLikes
                        .filter((like) => like.type && like.type.toLowerCase().includes("post"))
                        .map((like) => like.id.toString());

                    newPosts = newPosts.map((post) => {
                        const alreadyLiked = post.is_liked || likedPostIds.includes(post.id.toString());
                        return { ...post, is_liked: alreadyLiked };
                    });
                } catch (e) {
                    console.error("Error fetching likes:", e);
                }
            }

            if (data.links && data.links.next) {
                setNextPageUrl(data.links.next);
            } else {
                setNextPageUrl(null);
            }

            const isFirstPage = url === getApi() + "/posts";
            if (isFirstPage) {
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

    async function fetchFollowedPosts(url = getApi() + "/posts/followed") {
        setLoadingFollowedPosts(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(url, {
                headers: { Authorization: "Bearer " + token },
            });
            const data = await response.json();

            let newPosts = [];
            if (data.data) {
                newPosts = data.data;
            } else if (Array.isArray(data)) {
                newPosts = data;
            }

            if (data.links && data.links.next) {
                setNextFollowedPageUrl(data.links.next);
            } else {
                setNextFollowedPageUrl(null);
            }

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
        const token = localStorage.getItem("token");
        const userJson = localStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;

        if (!token || !user) return;

        setLoadingUsers(true);
        try {
            const usersResponse = await fetch(getApi() + "/users", {
                headers: { Authorization: "Bearer " + token },
            });
            const usersData = await usersResponse.json();

            let allUsers = [];
            if (usersData.data) {
                allUsers = usersData.data;
            } else if (Array.isArray(usersData)) {
                allUsers = usersData;
            }

            const followsResponse = await fetch(getApi() + "/follows/" + user.id, {
                headers: { Authorization: "Bearer " + token },
            });
            const followsData = await followsResponse.json();

            let userFollows = [];
            if (followsData.data) {
                userFollows = followsData.data;
            } else if (Array.isArray(followsData)) {
                userFollows = followsData;
            }

            const followedIds = userFollows.map((f) => f.id);
            setFollows(followedIds);

            const notFollowedYet = allUsers.filter((u) => {
                return u.id !== user.id && !followedIds.includes(u.id);
            });
            const recommendations = notFollowedYet.slice(0, 3);
            setRecommendedUsers(recommendations);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingUsers(false);
        }
    }

    function updatePost(updatedPost) {
        setPosts((prev) =>
            prev.map((post) => {
                if (post.id === updatedPost.id) {
                    return updatedPost;
                }
                return post;
            }),
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
            setFollowedPosts((prev) => prev.filter((post) => String(post.user_id) !== String(id)));
        } else {
            setFollows((prev) => [...prev, id]);
        }

        try {
            const method = isFollowing ? "DELETE" : "POST";
            await fetch(getApi() + "/follows", {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    follower_id: user.id,
                    followed_id: id,
                }),
            });

            if (!isFollowing) {
                const response = await fetch(getApi() + "/posts/followed", {
                    headers: { Authorization: "Bearer " + token },
                });
                const data = await response.json();

                let incoming = [];
                if (data.data) {
                    incoming = data.data;
                } else if (Array.isArray(data)) {
                    incoming = data;
                }

                const newUserPosts = incoming.filter((post) => String(post.user_id) === String(id));

                if (newUserPosts.length > 0) {
                    setFollowedPosts((prev) => {
                        const existingIds = new Set(prev.map((post) => post.id));
                        const toAdd = newUserPosts.filter((post) => !existingIds.has(post.id));
                        const merged = [...toAdd, ...prev];
                        merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                        return merged;
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (isAuthenticated === true) {
            setLoadingPosts(true);
            setLoadingUsers(true);
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
