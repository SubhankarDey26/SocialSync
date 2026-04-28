import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./features/Auth/pages/Login"
import Register from "./features/Auth/pages/Register"


function AppRoutes(){
  return <BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
  </Routes>
  </BrowserRouter>
}

export default AppRoutes