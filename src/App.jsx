import AsideLayout from "./layout/AsideLayout";
import { useLocation, useNavigate } from "react-router-dom";
import DoneComponent from "./components/DoneComponent";
import RightAsideLayout from "./layout/rightAsideLayout";
import "./App.css";
import { useEffect } from "react";
import PostComponent from "./components/post/postComponent";
import { getApi } from "./config";

export default function App() {
    const location = useLocation();
    const navigate = useNavigate();

    const fromComment = location.state?.fromComment;

    useEffect(() => {
        if (fromComment) {
            navigate(location.pathname, { replace: true });
        }
    }, [fromComment, location.pathname, navigate]);

    return (
        <div className="app-container">
            <AsideLayout />

            <main className="main">
                <h2 className="feed-header">Valoraciones</h2>

                {fromComment && <DoneComponent />}

                <PostComponent />
            </main>

            <RightAsideLayout />
        </div>
    );
}
