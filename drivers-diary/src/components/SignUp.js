import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import { backendURL } from "./globalContext";

export default function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fName: "",
    lName: "",
    password: "",
    confirmPass: "",
    email: "",
    phone: "",
    owner: "",
    dispacherPercentage: 0,
  });
  const changeValue = (e) => {
    const copyUser = { ...user };
    if (e.target) {
      const name = e.target.name;
      const value = e.target.value;
      if (name === "dispacherPercentage" && (value >= 100 || value < 0)) {
        return;
      }
      copyUser[name] = value;
      setUser(copyUser);
    } else {
      copyUser.phone = e;
      setUser(copyUser);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPass) {
      alert("password should be same");
    } else if (user.phone.length !== 11) {
      alert("Please enter valid phone number");
    } else {
      const { confirmPass, ...newUser } = user;
      try {
        const data = (await axios.post(`${backendURL}/users`, newUser)).data;
        if (data.success) {
          navigate("/signin");
        } else {
          alert(data.msg);
        }
      } catch (e) {
        alert("something went wrong. Please try again");
      }
    }
  };
  function goToSignIn() {
    navigate("/signin");
  }

  const inputs = [
    { name: "fName", ph: "First name", type: "text", min: 1, max: 30 },
    { name: "lName", ph: "Last name", type: "text", min: 1, max: 30 },
    { name: "email", ph: "Email", type: "email", min: 4, max: 50 },
    { name: "password", ph: "Password", type: "password", min: 4, max: 10 },
    {
      name: "confirmPass",
      ph: "Confirm password",
      type: "password",
      min: 4,
      max: 10,
    },
    {
      name: "dispacherPercentage",
      ph: "dispatcher's percentage",
      type: "number",
    },
  ];
  return (
    <div className="container">
      <div className="inp-container">
        <form onSubmit={onSubmit}>
          {inputs.map((item) => {
            const val = user[item.name];
            return (
              <>
                <input
                  key={item.name}
                  className="mb-2"
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
                <br />
              </>
            );
          })}
          <PhoneInput
            country={"us"}
            onChange={(event) => changeValue(event)}
            name="phone"
            value={user.phone}
          />
          <span>are you the owner of the truck</span>
          <br />
          <input
            type="radio"
            name="ownership"
            value="yes"
            checked="checked"
            onChange={changeValue}
          />
          yes&nbsp;
          <input
            type="radio"
            name="ownership"
            value="no"
            onChange={changeValue}
          />
          no
          <br />
          <button type="submit" className="btn btn-primary">
            {" "}
            Sign Up
          </button>
        </form>
        <div>
          you already have an account? <span onClick={goToSignIn}>Sign In</span>
        </div>
      </div>
    </div>
  );
}
