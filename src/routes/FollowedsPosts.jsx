import PostComponent from "../components/post/PostComponent";

export default function FollowedsPosts() {
    return (
        <>
            <h2 className="feed-header">Valoraciones de seguidos</h2>
            <PostComponent fromFollowed={true} />
        </>
    );
}
