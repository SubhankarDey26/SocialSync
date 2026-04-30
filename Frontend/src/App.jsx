import { RouterProvider } from 'react-router'
import {router} from "./app.routes"
import "./features/shared/global.scss"
import { AuthProvider } from './features/Auth/auth.context'

const App = () => {
  return (
    <AuthProvider>
        < postContextProvider>
          <RouterProvider router={router}/>
        </postContextProvider>
    </AuthProvider>

  )
}

export default App