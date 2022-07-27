import React, {  useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Navbar from "./Navbar";
import AddLoad from "./AddLoad";
import ListLoad from "./ListLoad";
import EditLoad from "./EditLoad"
import {  backendURL, LoadProvider } from "./globalContext";

export default function Loads() {

  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const [page, setPage] = useState("list");
  const [loads, setLoads] = useState([]);
  const [startEndDate,setStartEndDate] =useState()
  const [loadToEdit,setLoadToEdit] = useState()
  const [token,setToken]= useState()
  
  useEffect(() => {
    const getToken = async () => {
      const localStorageToken = await localStorage.getItem(
        "drivers_diary_token"
      );
      if (localStorageToken) {
        const profileFromToken = jwt_decode(localStorageToken);
        setToken(localStorageToken)
        setProfile(profileFromToken);
        fetchLoads(profileFromToken,localStorageToken);
      } else {
        navigate("/signin");
      }
    };
    getToken();

  }, []);
 
   const fetchLoads = async (profile,token) => {
    const date = new Date();
    try {
      const data = (
        await axios.get(
          `${backendURL}/diaries/${profile.email}/loads?date=${date}`,
          { "headers": { 'Authorization': token } }
        )
      ).data;
      if (data.success) {
        setLoads(data.msg.loads);
        setStartEndDate({endDate:data.msg.endDate,startDate:data.msg.startDate})
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("something went wrong please try again later!");
    }
  };
  async function deleteLoad(load) {
    await axios.delete(
      `${backendURL}/diaries/${profile.email}/loads/${load._id}?endDate=${startEndDate.endDate}`,
      { "headers": { 'Authorization': token } }
    );
    const loadsCopy = loads.filter(item=>item._id!==load._id)
    setLoads(loadsCopy) 
  }
  async function editLoad(load){
    setLoadToEdit(load);
    setPage('edit');
  }
  return (
    <div className="big-container load">
      {profile && <Navbar user={profile} />}
      <LoadProvider value={{token, loads,profile, setPage,editLoad, deleteLoad, setLoads,fetchLoads,startEndDate }}>
        {page === "add" && <AddLoad />}
        {page === "list" && <ListLoad />}
        {page==='edit'&&<EditLoad loadToEdit={loadToEdit}/>}
      </LoadProvider>
    </div>
  );
}
