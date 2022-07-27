import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { globalContext} from "./globalContext";

export default function Home() {
  const globalconsumer = useContext(globalContext);
  const navigate = useNavigate();
  //LOOK FOR USER IN LOCALSTORAGE
  useEffect(() => {
    const getToken = async () => {
      const localStorageToken = await localStorage.getItem(
        "drivers_diary_token"
      );
      if (localStorageToken) {
        const profileFromToken = jwt_decode(localStorageToken);
        globalconsumer.setProfile(profileFromToken);
        navigate("/loads");
      } else {
        navigate("/signin");
      }
    };
    getToken();
  }, []);

  return <div></div>;
}
