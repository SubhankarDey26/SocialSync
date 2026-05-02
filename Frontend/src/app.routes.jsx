// import { createBrowserRouter } from "react-router";
// import Login from "./features/Auth/pages/Login";
// import Register from "./features/Auth/pages/Register";
// import Feed from "./features/Post/pages/Feed";
// import CreatePost from "./features/Post/pages/CreatePost";
// import Profile from "./features/Profile/pages/Profile";
// import FollowRequests from "./features/Profile/pages/FollowRequests";
// import Followers from "./features/Profile/pages/Followers";
// import Following from "./features/Profile/pages/Following";

// export const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <Login />,
//   },
//   {
//     path: "/register",
//     element: <Register />,
//   },
//   {
//     path: "/",
//     element: <Feed />,
//   },
//   {
//     path: "/create-post",
//     element: <CreatePost />,
//   },
//   {
//     path: "/profile",
//     element: <Profile />,
//   },
//   {
//     path: "/follow-requests",
//     element: <FollowRequests />,
//   },
//   {
//     path: "/followers",
//     element: <Followers />,
//   },
//   {
//     path: "/following",
//     element: <Following />,
//   },
// ]);
























import { createBrowserRouter } from "react-router-dom";

import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import Feed from "./features/Post/pages/Feed";
import CreatePost from "./features/Post/pages/CreatePost";
import Profile from "./features/Profile/pages/Profile";
import FollowRequests from "./features/Profile/pages/FollowRequests";
import Followers from "./features/Profile/pages/Followers";
import Following from "./features/Profile/pages/Following";

// Import routes
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export const router = createBrowserRouter([
  // PUBLIC ROUTES
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

  // PROTECTED ROUTES
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Feed />
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-post",
    element: (
      <ProtectedRoute>
        <CreatePost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/follow-requests",
    element: (
      <ProtectedRoute>
        <FollowRequests />
      </ProtectedRoute>
    ),
  },
  {
    path: "/followers",
    element: (
      <ProtectedRoute>
        <Followers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/following",
    element: (
      <ProtectedRoute>
        <Following />
      </ProtectedRoute>
    ),
  },
]);