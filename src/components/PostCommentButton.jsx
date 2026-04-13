import { usePostContext } from "../providers/PostProvider";

export default function PostCommentButton() {
    const { post } = usePostContext();

    const countComments = post.count_comments ? post.count_comments : 0;

    const handleComment = () => {
        console.log("Abrir comentarios para el post:", post.id);
    };

    return (
        <button className="action-btn" onClick={handleComment}>
            <span className="material-symbols-outlined">chat_bubble</span>
            {countComments}
        </button>
    );
}
