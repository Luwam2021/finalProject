import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import axios from "axios";
import { backendURL } from "./globalContext";

import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Navbar from "./Navbar";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const [token, setToken] = useState();
  useEffect(() => {
    const getToken = async () => {
      const localStorageToken = await localStorage.getItem(
        "drivers_diary_token"
      );
      if (localStorageToken) {
        const profileFromToken = jwt_decode(localStorageToken);
        setProfile(profileFromToken);
        setToken(localStorageToken);
      } else {
        navigate("/signin");
      }
    };
    getToken();
  }, []);
  const logout = async () => {
    await localStorage.removeItem("drivers_diary_token");
    navigate("/signin");
  };
  const changeValue = (e) => {
    const copyprofile = { ...profile };
    if (e.target) {
      const name = e.target.name;
      const value = e.target.value;
      if (name === "dispacherPercentage" && (value >= 100 || value < 0)) {
        return;
      }
      copyprofile[name] = value;
      setProfile(copyprofile);
    } else {
      copyprofile.phone = e;
      setProfile(copyprofile);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (profile.phone.length !== 11) {
      alert("Please enter valid phone number");
    } else {
      const toEdit = {
        fName: profile.fName,
        lName: profile.lName,
        phone: profile.phone,
      };
      try {
        const data = (
          await axios.patch(`${backendURL}/users/${profile.email}`, toEdit, {
            headers: { Authorization: token },
          })
        ).data;
        if (data.success) {
          await localStorage.setItem("drivers_diary_token", data.msg.token);
          alert("your profile is successfully updated");
          navigate("/loads");
        } else {
          alert(data.msg);
        }
      } catch (e) {
        alert("something went wrong. Please try again");
      }
    }
  };
  return (
    <div>
      <Navbar />
      <button onClick={logout}> Logout</button>
      {profile && (
        <div className="container">
          <form onSubmit={onSubmit}>
            First Name{" "}
            <input
              className="form-control"
              type="text"
              value={profile.fName}
              name="fName"
              minLength="1"
              maxLength="50"
              required
              onChange={(e) => {
                changeValue(e);
              }}
            />
            Last Name
            <input
              type="text"
              className="form-control"
              value={profile.lName}
              name="lName"
              minLength="1"
              maxLength="50"
              required
              onChange={(e) => {
                changeValue(e);
              }}
            />
            <PhoneInput
              country={"us"}
              onChange={(event) => changeValue(event)}
              name="phone"
              value={profile.phone}
            />
            <br />
            <button type="submit" className='adding-btn btn btn-primary'> Edit</button>
          </form>
        </div>
      )}
    </div>
  );
}
