import { Outlet } from "react-router-dom";
import AsideLayout from "../layout/AsideLayout";
import RightAsideLayout from "../layout/RightAsideLayout";

export default function Home() {
    return (
        <div className="app-container">
            <AsideLayout />
            
            <main className="main">
                <Outlet />
            </main>

            <RightAsideLayout />
        </div>
    );
}
