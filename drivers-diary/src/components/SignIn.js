import React, { useState, useContext } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { globalContext, backendURL } from "./globalContext";

export default function SignIn() {
  //STATES
  const globalconsumer = useContext(globalContext);
  const navigate = useNavigate()
  const [user, setUser] = useState({
    password: "",
    email: ""
  });
  const changeValue = (e) => {
    const copyUser = { ...user };
    copyUser[e.target.name] = e.target.value;
    setUser(copyUser);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = (await axios.post(`${backendURL}/users/signin`, user)).data;
      if (data.success) {
        const token = data.msg.token;
        await localStorage.setItem("drivers_diary_token", token);
        const profileFromToken = jwt_decode(token);
        globalconsumer.setToken(token)
        globalconsumer.setCurrentDiary(data.msg.diary);
        globalconsumer.setProfile(profileFromToken)
        navigate('/income')
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("something went wrong. Please try again");
    }
  };
  function goToSignUp() {
    navigate('/signup')
  }
  const inputs = [
    { name: "email", ph: "Email", type: "email", min: 4, max: 50 },
    { name: "password", ph: "Password", type: "password", min: 4, max: 10 },
  ];
  return (
    <div className="container">
      <div className="inp-container">
        <form onSubmit={onSubmit}>
          {inputs.map((item) => {
            const val = user[item.name];
            return (
              <input
                key={item.name}
                className='mb-2'
                placeholder={item.ph}
                type={item.type}
                value={val}
                name={item.name}
                minLength={item.min}
                maxLength={item.max}
                required
                onChange={(e) => {
                  changeValue(e);
                }}
              />
            );
          })}
          <br />
          <button type ='submit' className='btn btn-primary'> Sign In</button>
        </form>
        <div>
          you don't have account? <span onClick={goToSignUp}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}
