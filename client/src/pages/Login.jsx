import { useState } from "react";
import { styled } from "styled-components";
import { apiUrl } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";
const Log = styled.section`
   min-height: 80vh;
  background: black;
  .lipg {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 125px;
  }

  .frm {
   display: flex;
   flex-direction: column;
    height: 60rem;
    background-color: azure;
    justify-content: space-around;
    
    padding-left: 15px;
    border-radius: 5px;
    padding:4rem;
  }

  .input-container{
    input{
      font-size: 1.6rem;
      padding: 3rem 1rem;
    }
    label{
      display: block;
      margin-bottom: 1rem;
    }

  }

  h2 {
    text-align: center;
    font-size: 25px;
  }

  #email {
    width: 350px;
    height: 30px;
  }

  #pass {
    width: 350px;
    height: 30px;
  }
  #name {
    width: 350px;
    height: 30px;
  }

  button {
    border: none;
    width: 350px;
    height: 40px;
    background-color: rgb(0, 113, 243);
    font-size: 1.6rem;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .fp {
    text-align: center;
    font-size: 13px;
  }

  .da {
    text-align: center;
    font-size: 1.6rem;
  }

  a {
    text-decoration: none;
    font-size: 1.6rem;
  }
  label {
    font-size: 18px;
  }
`;

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const { role, login } = useAuth();


  const navigate = useNavigate();
  console.log(role);
  const Singin = async () => {
    try {
      let msg = await axios.post(
        apiUrl + "/login",
        { email: email, password: password },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(msg.data);
      if (msg.data.token != undefined) {
        localStorage.setItem("user",JSON.stringify(msg.data.user))
        
        if (msg.data.role === "admin") {
          window.localStorage.setItem("token", msg.data.token);
          await login();
          toast.success("Admin Logged in")
          navigate('/admin')
        }
        else if (msg.data.role === "mentor" ) {
          if(msg.data.ver){

            window.localStorage.setItem("token", msg.data.token);
            await login();
            toast.success("Mentor logged in")
            navigate('/')
          }else{
            toast.error("Mentor is not verified")
          }
        }
        else {
          window.localStorage.setItem("token", msg.data.token);
          await login();
          toast.success(msg.data.msg)
          navigate("/");
        }
        window.location.reload();
      }
      else {
        toast.error(msg.data.msg)
      }
    } catch (error) {
      toast.error("Server error try again");
    }
  };

  return (
    <Log>
      <div className="lipg">
        <div className="frm">

          <h2>Login</h2>
          <div className="input-container">

            <label htmlFor="email">Email :</label>
            <input
              type="email"
              placeholder="Enter email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div className="input-container">

            <label htmlFor="pass">Password :</label>
            <input
              type="password"
              placeholder="Enter password"
              id="pass"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>

          <div className="input-container">
            <button onClick={Singin}>SIGN IN</button>
          </div>

          <div className="da">
            Dont have an account ? <a href="/register">Register</a>
          </div>
        </div>
      </div>
    </Log>
  );
};

export default Login;
