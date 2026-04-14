import { Outlet } from "react-router-dom";
import AsideLayout from "../layout/asideLayout";
import RightAsideLayout from "../layout/rightAsideLayout";

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
