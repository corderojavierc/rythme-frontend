import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Login from "./routes/Login";
import Register from "./routes/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { AuthProvider } from "./auth/AuthProvider";
import FollowedsPosts from "./routes/FollowedsPosts";
import Feed from "./routes/Feed";
import CommentPage from "./routes/CommentPage";
import Home from "./routes/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <Home />,
                children: [
                    {
                        path: "/",
                        element: <Feed />,
                    },
                    {
                        path: "/followed",
                        element: <FollowedsPosts />,
                    },
                    {
                        path: "/posts/:id/comment",
                        element: <CommentPage />,
                    },
                ],
            },
        ],
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/register",
        element: (
            <PublicRoute>
                <Register />
            </PublicRoute>
        ),
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>,
);
