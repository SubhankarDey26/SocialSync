import { RouterProvider } from 'react-router'
import { router } from "./app.routes"
import "./features/shared/global.scss"
import { AuthProvider } from './features/Auth/auth.context'
import { PostContextProvider } from './features/Post/post.context'

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <RouterProvider router={router} />
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App