// Feed de posts de los usuarios que sigue el usuario logueado.
// Reutiliza PostComponent con fromFollowed=true para usar los datos de followedPosts en lugar de posts.
import PostComponent from "../components/post/PostComponent";

export default function FollowedsPosts() {
  return (
    <>
      <h2 className="feed-header">Valoraciones de seguidos</h2>
      <PostComponent fromFollowed={true} />
    </>
  );
}
