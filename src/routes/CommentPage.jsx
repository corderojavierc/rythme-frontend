import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PostCardComponent from "../components/post/PostCardComponent";
import CreateCommentComponent from "../components/comment/CreateCommentComponent";
import LoaderScreen from "../components/LoaderScreen";
import { getApi } from "../config";
import { useData } from "../providers/DataProvider";

const API_POST_URL = getApi() + "/posts";

export default function CommentPage() {
    const { id } = useParams();
    const location = useLocation();
    const { posts, followedPosts, musicPosts, loadingPosts } = useData();

    const [post, setPost] = useState(() => {
        if (location.state?.post) return location.state.post;

        const allPosts = [...posts, ...followedPosts, ...musicPosts];
        return allPosts.find((p) => String(p.id) === String(id));
    });
    const [isLoading, setIsLoading] = useState(!post);

    useEffect(() => {
        const allPosts = [...posts, ...followedPosts, ...musicPosts];
        const cachedPost =
            location.state?.post ||
            allPosts.find((p) => String(p.id) === String(id));

        if (cachedPost) {
            setPost(cachedPost);
            setIsLoading(false);
            return;
        }

        if (id && !loadingPosts && !post) {
            async function fetchPost() {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(API_POST_URL + "/" + id, {
                        headers: { Authorization: "Bearer " + token },
                    });
                    const data = await response.json();

                    if (data.data) {
                        setPost(data.data);
                    } else {
                        setPost(data);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchPost();
        }
    }, [id, posts, followedPosts, musicPosts, loadingPosts, post, location.state]);

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
