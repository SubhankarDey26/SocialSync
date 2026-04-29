import "../styles/form.scss";
import {Link} from 'react-router'
import { useState } from "react";
import {useAuth} from "../hooks/useAuth"
import { useNavigate } from "react-router-dom";

const Register = () => {

  const {loading,HandleRegister}=useAuth()
  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const navigate=useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    await HandleRegister(username,email,password)
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
        <h1>Register 🚀</h1>
        <p>Create your account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
            onInput={(e)=>{
              setusername(e.target.value)
            }}
              type="text"
              name="username"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="input-group">
            <input
            onInput={(e)=>{
              setemail(e.target.value)
            }}
              type="email"
              name="email"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="input-group">
            <input
            onInput={(e)=>{
              setpassword(e.target.value)
            }}
              type="password"
              name="password"
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit">Register</button>
           <span className="extra">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </main>
  );
};

export default Register;