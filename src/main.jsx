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
import SearchPage from "./routes/SearchPage";
import ProfilePage from "./routes/ProfilePage";
import GlobalEventPage from "./routes/GlobalEventPage";
import ApplicationPage from "./routes/ApplicationPage";
import GlobalMusicPage from "./routes/GlobalMusicPage";
import MusicPage from "./routes/MusicPage";
import CommentPage from "./routes/CommentPage";
import PostPage from "./routes/PostPage";
import { DataProvider } from "./providers/DataProvider";
import ApplicationForm from "./components/application/ApplicationForm";
import CreatePost from "./routes/CreatePost";
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
            path: "/music",
            element: <GlobalMusicPage />,
          },
          {
            path: ":username/posts/:id/comment",
            element: <CommentPage />,
          },
          {
            path: ":username/posts/:id",
            element: <PostPage />,
          },
          {
            path: "/music/:id",
            element: <MusicPage />,
          },
          {
            path: "/rate",
            element: <CreatePost />,
          },
          {
            path: "/events",
            element: <GlobalEventPage />,
          },
          {
            path: "/request",
            element: <ApplicationPage />,
          },
          {
            path: "/request/form",
            element: <ApplicationForm />,
          },
          {
            path: "/search",
            element: <SearchPage />,
          },
          {
            path: ":username",
            element: <ProfilePage />,
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
  <AuthProvider>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </AuthProvider>,
);
