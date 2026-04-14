import PostComponent from "../components/post/postComponent";

export default function FollowedsPosts() {
    return (
        <>
            <h2 className="feed-header">Valoraciones de seguidos</h2>
            <PostComponent fromFollowed={true} />
        </>
    );
}
