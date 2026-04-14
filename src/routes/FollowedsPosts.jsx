import AsideLayout from "../layout/asideLayout";
import RightAsideLayout from "../layout/rightAsideLayout";
import PostComponent from "../components/post/postComponent";

export default function FollowedsPosts() {
    return (
        <div className="app-container">
            <AsideLayout />

            <main className="main">
                <h2 className="feed-header">Valoraciones</h2>
                <PostComponent />
            </main>
            <RightAsideLayout />
        </div>
    );
}
