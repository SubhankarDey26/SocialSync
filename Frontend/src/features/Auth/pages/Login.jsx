import "../styles/form.scss";
import {Link} from 'react-router'
import { useState } from "react";
import axios from "axios"

const Login = () => {

  async function SubmitHandler(e) {
    e.preventDefault()
    axios.post("http://localhost:3000/api/auth/login",{
      username,password
    },{withCredentials:true})
    .then(res=>{
      console.log(res.data)
    })

  }

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")

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