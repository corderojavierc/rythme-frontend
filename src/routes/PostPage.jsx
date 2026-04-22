import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCardComponent from "../components/post/PostCardComponent";
import CommentComponent from "../components/comment/CommentComponent";
import LoaderScreen from "../components/LoaderScreen";
import { getApi } from "../config";
import { useData } from "../providers/DataProvider";

export default function PostPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { posts, loadingPosts } = useData();

    const [post, setPost] = useState(() => posts.find((p) => String(p.id) === String(id)));
    const [isLoadingPost, setIsLoadingPost] = useState(!post);

    const token = localStorage.getItem("token");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const cachedPost = posts.find((p) => String(p.id) === String(id));

        if (cachedPost) {
            setPost(cachedPost);
            setIsLoadingPost(false);
        } else if (id && !loadingPosts && !post) {
            setIsLoadingPost(true);
            fetch(getApi() + "/posts/" + id, {
                headers: { Authorization: "Bearer " + token },
            })
                .then((res) => res.json())
                .then((data) => {
                    setPost(data.data || data);
                })
                .catch((err) => console.error(err))
                .finally(() => setIsLoadingPost(false));
        }
    }, [id, posts, loadingPosts, token, post]);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <button
                    className="back-button"
                    title="Go Back"
                    onClick={() => navigate(-1)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        viewBox="0 0 24 24"
                    >
                        <path d="M11 6L5 12M5 12L11 18M5 12H19"></path>
                    </svg>
                </button>
                <h2
                    className="feed-header"
                    style={{
                        marginBottom: 0,
                        borderBottom: "none",
                        paddingBottom: 0,
                    }}
                >
                    Post
                </h2>
            </div>

            <div
                style={{
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    marginBottom: "24px",
                }}
            ></div>

            {isLoadingPost && !post ? (
                <LoaderScreen />
            ) : (
                post && (
                    <>
                        <PostCardComponent post={post} type="fromPost" />

                        <h3
                            className="section-title"
                            style={{ marginTop: "40px", marginBottom: "20px" }}
                        >
                            Comentarios ({post.count_comments || 0})
                        </h3>

                        <CommentComponent postId={id} />
                    </>
                )
            )}
        </>
    );
}
