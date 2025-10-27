import { useState } from "react";
import { styled } from "styled-components";
import { apiUrl } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast"
const Reg = styled.section`
   min-height: 80vh;
  background-color: black;
  .lipg {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 125px;
  }

  .frm {
   display: flex;
   flex-direction: column;
    height: 80rem;
    background-color: azure;
    justify-content: space-around;
    
    padding-left: 15px;
    border-radius: 5px;
    padding:4rem;
  }

  .input-container{
    input{
      width: 100%;
      font-size: 1.6rem;
      padding: 1rem .5rem;
      margin-bottom: 1.5rem;
    }
    label{
      display: block;
      margin-bottom: .5rem;
    }

  }
  
  h2 {
    text-align: center;
    font-size: 25px;
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
  .checkbox-text{
    text-align: center;
  }
#check{
  width: 3rem;
  height: 3rem;
  display: block;
  margin: 0 auto;
  margin-bottom: 2rem;
}

`;
const Registration = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isMentor, setIsMentor] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  


  const { login } = useAuth();

  const navigate = useNavigate();


  const SignUp = async (e) => {
    e.preventDefault();
    console.log("reached");
  
    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/; // Only 10 digits
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
  
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
      } else {
        const response = await axios.post(
          `${apiUrl}/signup`,
          {
            name: name,
            email: email,
            password: password,
            isMentor: isMentor,
            phone: phone,
            address: address,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );
  
        const responseData = await response.data;
        console.log(response);
  
        if (responseData.token) {
          window.localStorage.setItem("token", responseData.token);
          localStorage.setItem("user",JSON.stringify(msg.data.user))
          toast.success(responseData.msg);
          login();
          navigate("/");
        } else {
          toast.error(responseData.msg);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  




  return (
    <Reg>
      <div className="lipg">
        <form className="frm" onSubmit={e => SignUp(e)}>
          <h2>Register</h2>

          <div className="input-container">

            <label htmlFor="name">Name :</label>
            <input
              type="name"
              placeholder="Enter name"
              required
              id="email"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              placeholder="Enter email"
              required
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div className="input-container">

<label htmlFor="name">Address :</label>
<input
  type="name"
  placeholder="Enter Address"
  required
  id="email"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
/>
</div>
<div className="input-container">

<label htmlFor="name">Phone :</label>
<input
  type="number"
  placeholder="Enter Phone Number"
  required
  id="email"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
</div>
          <div className="input-container">
            <label htmlFor="pass">Password :</label>
            <input
              type="password"
              placeholder="Enter password"
              id="pass"
              required
              className="pass"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />

          </div>
          <div className="input-container">
            <label htmlFor="confirm-pass">Confirm Password :</label>
            <input
              type="password"
              placeholder="Enter password"
              id="confirm-pass"
              className="pass"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="input-container">
            <label className="checkbox-text" >Are you a Mentor</label>
            <input
              type="checkbox"
              id="check"
              value={isMentor}
              onChange={e => setIsMentor(e.target.checked)}
            />

          </div>

          <div className="input-container">

            <button >SIGN UP</button>
          </div>


          <div className="da">
            Have an account ? <a href="/login">Login here</a>
          </div>
        </form>
      </div >
    </Reg >
  );
};

export default Registration;
