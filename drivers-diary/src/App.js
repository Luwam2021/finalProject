import "./App.css";
import React, { useState,useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/Home";
import Expenses from "./components/Expenses";
import Income from "./components/Income";
import Loads from "./components/Loads";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import {
  GlobalProvider
} from "./components/globalContext";

function App() {
  const [token, setToken] = useState();
  const [page, setPage] = useState("SignIn");
  const [profile, setProfile] = useState();
  const [currentDiary, setCurrentDiary] = useState();
 
  useEffect(() => {
    const getToken = async () => {
      const localStorageToken = await localStorage.getItem(
        "drivers_diary_token"
      );
      if (localStorageToken) {
       setToken(localStorageToken)
      } else {
       
      }
    };
    getToken();
  })
  return (<>
      <Router>
        <GlobalProvider
          value={{
            setPage,
            setToken,
            page,
            profile,
            setProfile,
            currentDiary,
            setCurrentDiary,
          }}
        >
          <Routes>
            <Route path="/signin" exact element={<SignIn />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/" exact element={<Home />} />
            <Route path ='/profile' exact element={<Profile/>}/>
                <Route path="/expenses" exact element={<Expenses />} />
                <Route path="/loads" exact element={<Loads />} />
                <Route path="/income" exact element={<Income />} />
            
          </Routes>{" "}
        </GlobalProvider>
      </Router>
    </>
  );
}

export default App;
