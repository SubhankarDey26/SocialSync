import {createBrowserRouter} from "react-router"
import Login from "./features/Auth/pages/Login"
import Register from "./features/Auth/pages/Register"
import Feed from "./features/Post/pages/Feed"
export const router=createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Feed/>
    }
])