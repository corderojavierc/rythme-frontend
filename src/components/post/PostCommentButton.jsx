import { usePostContext } from "../../providers/PostProvider";

export default function PostCommentButton() {
    const { post } = usePostContext();

    const countComments = post.count_comments ? post.count_comments : 0;

    const handleComment = () => {
        window.location.href = `/posts/${post.id}/comment`;
    };

    return (
        <button className="action-btn" onClick={handleComment}>
            <span className="material-symbols-outlined">chat_bubble</span>
            {countComments}
        </button>
    );
}
