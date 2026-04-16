import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCardComponent from "../components/post/PostCardComponent";
import CreateCommentComponent from "../components/comment/CreateCommentComponent";
import LoaderScreen from "../components/LoaderScreen";
import { getApi } from "../config";
import { useData } from "../providers/DataProvider";

const API_POST_URL = `${getApi()}/posts`;

export default function CommentPage() {
    const { id } = useParams();
    const { posts, loadingPosts } = useData();

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cachedPost = posts.find(p => p.id == id);
        
        if (cachedPost) {
            setPost(cachedPost);
            setIsLoading(false);
        } else if (id && !loadingPosts) {
            async function fetchPost() {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`${API_POST_URL}/${id}`, {
                        headers: { Authorization: "Bearer " + token },
                    });
                    const data = await response.json();
                    setPost(data.data || data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchPost();
        }
    }, [id, posts, loadingPosts]);

    if (isLoading) return <LoaderScreen />;

    return (
        <>
            {post && (
                <>
                    <PostCardComponent post={post} type="comment" />
                    <div>
                        <CreateCommentComponent post={post} />
                    </div>
                </>
            )}
        </>
    );
}
