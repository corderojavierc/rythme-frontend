import { useNavigate } from "react-router-dom";
import { usePostContext } from "../../providers/PostProvider";

export default function PostCommentButton() {
  const { post } = usePostContext();
  const navigate = useNavigate();

  const commentCount = post.count_comments ? post.count_comments : 0;

  const handleComment = () => {
    navigate(`/${post.user_name}/posts/${post.id}/comment`, {
      state: { post },
    });
  };

  return (
    <button className="action-btn" onClick={handleComment}>
      <span className="material-symbols-outlined">chat_bubble</span>
      {commentCount}
    </button>
  );
}
