import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCardComponent from "../components/post/PostCardComponent";
import CommentCardComponent from "../components/comment/CommentCardComponent";
import LoaderScreen from "../components/LoaderScreen";
import { getApi } from "../config";
import { useData } from "../providers/DataProvider";

const API_POST_URL = getApi() + "/posts";

export default function PostPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { posts, loadingPosts } = useData();

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cachedPost = posts.find((p) => p.id == id);

        if (cachedPost) {
            setPost(cachedPost);
            setIsLoading(false);
            return;
        }
    }, [id, posts]);

    if (isLoading) return <LoaderScreen />;

    return (
        <>
            {post && (
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

                    <PostCardComponent post={post} type="fromPost" />
                    <CommentCardComponent post={post} />
                </>
            )}
        </>
    );
}
