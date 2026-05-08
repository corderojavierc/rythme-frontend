import { PostProvider } from "../../providers/PostProvider";
import { useNavigate } from "react-router-dom";
import PostLikeButton from "./PostLikeButton";
import PostCommentButton from "./PostCommentButton";
import { useData } from "../../providers/DataProvider";
import VerifiedBadgeComponent from "../VerifiedBadgeComponent";
import StarsComponent from "../music/StarsComponent";

export default function PostCardComponent({ post, type = "post" }) {
  const { updatePost } = useData();
  const navigate = useNavigate();

  let fullName = post.user_name || "Usuario";
  if (post.name) {
    fullName = post.name;
  }

  function redirectToPost() {
    if (type === "fromPost") return;
    navigate(`/${post.user_name}/posts/${post.id}`, {
      state: { post },
    });
  }

  function redirectToProfile(e) {
    e.stopPropagation();
    navigate(`/${post.user_name}`, {
      state: {
        id: post.user_id,
        username: post.user_name,
        name: post.name,
        profile_image: post.profile_image,
        followers: post.followers,
        following: post.following,
        posts: post.posts,
        type: post.user_type || post.type,
        musics: post.musics || 0,
      },
    });
  }

  function redirectToMusic(e) {
    e.stopPropagation();
    navigate(`/music/${post.music_id}`, {
      state: {
        songName: post.music,
        artist: post.artist,
        cover_url: post.cover_url,
        global_rating: post.global_rating,
        count_ratings: post.count_ratings,
        is_valorated: post.is_valorated,
      },
    });
  }

  const rating = post.rating ? parseFloat(post.rating) : 0;

  return (
    <PostProvider post={post} onUpdate={updatePost}>
      <div className="rating-card" onClick={redirectToPost}>
        <div
          className="rating-header"
          onClick={redirectToProfile}
          style={{
            width: "fit-content",
          }}
        >
          <div className="avatar">
            <img src={post.profile_image} alt={fullName} />
          </div>
          <div className="user-info">
            <div className="user-name">
              {fullName}
              <VerifiedBadgeComponent type={post.user_type || post.type} />
            </div>
            <div className="user-handle">@{post.user_name}</div>
          </div>
        </div>
        <div className="song-block" onClick={redirectToMusic}>
          <div className="cover">
            <img
              src={post.cover_url}
              alt={post.music}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="song-info">
            <div className="song-title">{post.music}</div>
            <div className="song-artist">{post.artist}</div>
          </div>
        </div>

        <div className="rating-content">
          <div className="stars-display-row">
            <StarsComponent rating={rating} />
            <span className="rating-score-display">{rating.toFixed(2)}</span>
          </div>
          <div className="comment">{post.title}</div>
        </div>

        {type === "post" && (
          <div className="actions" onClick={(e) => e.stopPropagation()}>
            <PostLikeButton />
            <PostCommentButton />
          </div>
        )}
      </div>
    </PostProvider>
  );
}
