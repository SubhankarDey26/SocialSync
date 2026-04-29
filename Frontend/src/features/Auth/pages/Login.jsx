import "../styles/form.scss";
import {Link} from 'react-router'
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {

  const {loading,HandleLogin}=useAuth()
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")

  const navigate=useNavigate()

  async function SubmitHandler(e) {
    e.preventDefault()
    await HandleLogin(username,password)

    navigate('/')

  }

  if(loading)
  {
    return (<main>
      <h1>Loading....</h1>
    </main>)
  }

  
  return (
    <main className="login-page">
      <div className="form-container">
        <h1>Welcome Back 👋</h1>
        <p>Login to continue</p>

        <form onSubmit={SubmitHandler}>
          <div className="input-group">
            <input
            onInput={(e)=>{
              setusername(e.target.value)
            }}
             type="text" 
             placeholder="Username" 
             required />
          </div>

          <div className="input-group">
            <input
            onInput={(e)=>{
              setpassword(e.target.value)
            }} 
            type="password" 
            placeholder="Password" 
            required />
          </div>

          <button type="submit">Login</button>

          <span className="extra">
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
    </main>
  );
};

export default Login;