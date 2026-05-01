import { createBrowserRouter } from "react-router";
import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import Feed from "./features/Post/pages/Feed";
import CreatePost from "./features/Post/pages/CreatePost";
import Profile from "./features/Profile/pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Feed />,
  },
  {
    path: "/create-post",
    element: <CreatePost />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);