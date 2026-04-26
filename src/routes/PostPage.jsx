import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PostCardComponent from "../components/post/PostCardComponent";
import CommentComponent from "../components/comment/CommentComponent";
import LoaderScreen from "../components/LoaderScreen";
import { getApi } from "../config";
import { useData } from "../providers/DataProvider";

export default function PostPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const {
    posts,
    followedPosts,
    musicPosts,
    loadingPosts,
    loadingFollowedPosts,
    loadingMusicPosts,
  } = useData();

  const [post, setPost] = useState(() => {
    if (location.state?.post) return location.state.post;

    const allPosts = [...posts, ...followedPosts, ...musicPosts];
    return allPosts.find((p) => String(p.id) === String(id));
  });
  const [isLoadingPost, setIsLoadingPost] = useState(!post);

  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const allPosts = [...posts, ...followedPosts, ...musicPosts];
  const cachedPost =
    location.state?.post || allPosts.find((p) => String(p.id) === String(id));

  const [prevId, setPrevId] = useState(id);

  if (id !== prevId) {
    setPrevId(id);
    if (cachedPost) {
      setPost(cachedPost);
      setIsLoadingPost(false);
    } else {
      setPost(null);
      setIsLoadingPost(true);
    }
  }

  useEffect(() => {
    if (
      !post &&
      id &&
      !loadingPosts &&
      !loadingFollowedPosts &&
      !loadingMusicPosts &&
      isLoadingPost
    ) {
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
  }, [
    id,
    loadingPosts,
    loadingFollowedPosts,
    loadingMusicPosts,
    token,
    post,
    isLoadingPost,
  ]);

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
          <span className="material-symbols-outlined">arrow_back</span>
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
