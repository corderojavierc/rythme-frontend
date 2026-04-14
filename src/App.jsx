import AsideLayout from "./layout/asideLayout";
import RightAsideLayout from "./layout/rightAsideLayout";
import "./App.css";
import PostComponent from "./components/post/postComponent";

export function getApi() {
    return "http://localhost:8000/api";
}

export default function App() {
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
