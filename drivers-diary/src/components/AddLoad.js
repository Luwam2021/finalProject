import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import {formatDate} from './helper'
import { globalContext, backendURL,loadContext } from "./globalContext";

export default function AddLoad() {
  const globalconsumer = useContext(globalContext);
  const loadconsumer = useContext(loadContext);
  const navigate = useNavigate();
  useEffect(() => {
    const getToken = async () => {
      const localStorageToken = loadconsumer.token;
      if (localStorageToken) {
        const profileFromToken = jwt_decode(localStorageToken);
        globalconsumer.setProfile(profileFromToken);
      } else {
        navigate("/signin");
      }
    };
    getToken();
  }, []);
  const [load, setLoad] = useState({
    from: "",
    to: "",
    date: null,
    amount: 0,
    picture: "",
    loadNumber: "",
  });
  const changeValue = (e) => {
    const copyLoad = { ...load };
    copyLoad[e.target.name] = e.target.value;
    setLoad(copyLoad);
  };
  const changeDate = (event) => {
    setLoad({ ...load, date: event.target.selected });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const imgString = await uploadImg();
      const data = (
        await axios.post(
          `${backendURL}/diaries/${globalconsumer.profile.email}/loads`,
          {
            ...load,
            picture: imgString,
          },{ "headers": { 'Authorization': loadconsumer.token } }
        )
      ).data;
      if (data.success) {
        loadconsumer.fetchLoads( loadconsumer.profile,loadconsumer.token)
        alert("load is added");
       loadconsumer.setPage('list')
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("something went wrong. Please try again");
    }
  };
  async function uploadImg() {
    const formData = new FormData();
    formData.append("file", load.picture);
    try {
      const response = (
        await axios.post(`${backendURL}/diaries/files`, formData,{ "headers": { 'Authorization': loadconsumer.token } })
      ).data;
      if (response.success) {
        return response.msg.filename;
      } else {
        alert("something went wrong. Please try again");
      }
    } catch (e) {
      alert("something went wrong. Please try again");
    }
  }
  function selectImg(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      load.picture = file;
    }
  }
  const inputs = [
    { name: "from", ph: "From", type: "text", min: 4, max: 50 },
    { name: "to", ph: "To", type: "text", min: 4, max: 50 },
    { name: "loadNumber", ph: "Load Number", type: "text", min: 3, max: 10 },
  ];
  return (
    <div className="big-container">
      <button className='btn btn-secondary mt-3 mx-3' onClick={() => loadconsumer.setPage("list")}>list loads</button>
    <div className="container">
      <form onSubmit={onSubmit}>
        {inputs.map((item) => {
          const val = load[item.name];
          return (
            <>
              <label key={item.ph}>{item.ph}</label>
              <input
                key={item.name}
                className="form-control"
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
            </>
          );
        })}
        <label>Amount</label>
        <input
        className="form-control"
        type="number"
        value={load.amount}
        name='amount'
        min='0'
        required
        onChange={(e) => {
          changeValue(e);
        }}
        />
        <label>Date</label>
        <input
          className="form-control"
          type="date"
          selected={new Date()}
          required
           min={formatDate(loadconsumer.startEndDate.startDate)} 
           max={formatDate(loadconsumer.startEndDate.endDate)} 
          onChange={(e) => {
            changeDate(e);
          }}
        />
      <label>reciept image</label>
        <input
          className="form-control"
          type="file"
          name="picture"
          accept="image/x-png,image/gif,image/jpeg"
          onChange={selectImg}
        />
        <button className='adding-btn btn btn-primary' type="submit"> Add</button>
      </form>
    </div>
    </div>
  );
}
