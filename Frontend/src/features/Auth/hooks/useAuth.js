import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {login,register} from"../services/auth.api"

export const useAuth=()=>{
    const context=useContext(AuthContext)

    const {user,setuser,loading,setloading}=context

    const HandleLogin=async(username,password)=>{
        setloading(true)
        const response =await login(username,password)
        setuser(response.user)
        setloading(false)
    }

    const HandleRegister=async(username,email,password)=>{
        setloading(true)
        const response= await register(username,email,password)
        setuser(response.user)
        setloading(false)
    }

    return {
        user,loading,HandleLogin,HandleRegister
    }

}
