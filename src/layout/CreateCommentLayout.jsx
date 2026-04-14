import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AsideLayout from "./AsideLayout";
import RightAsideLayout from "./rightAsideLayout";
import PostCardComponent from "../components/post/PostCardComponent";
import CreateCommentComponent from "../components/comment/CreateCommentComponent";
import LoaderScreen from "../components/LoaderScreen";
import { getApi } from "../config";

const API_POST_URL = `${getApi()}/posts`;

export default function CreateCommentLayout() {
    const { id } = useParams();

    let token = localStorage.getItem("token");

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await fetch(`${API_POST_URL}/${id}`, {
                    headers: { Authorization: "Bearer " + token },
                });
                const data = await response.json();

                setPost(data.data || data);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchPost();
        }
    }, [id, token]);

    if (loading) return <LoaderScreen />;

    return (
        <div className="app-container">
            <AsideLayout />

            <main className="main">
                {post && (
                    <>
                        <PostCardComponent post={post} type="comment" />
                        <div style={{ margin: "24px 0" }}>
                            <CreateCommentComponent post={post} />
                        </div>
                    </>
                )}
            </main>

            <RightAsideLayout />
        </div>
    );
}
