import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { globalContext } from "./globalContext";
import Navbar from "./Navbar";
import { backendURL, LoadProvider } from "./globalContext";

export default function Income() {
  const navigate = useNavigate();
  const globalconsumer = useContext(globalContext);
  const [profile, setProfile] = useState();
  const [income, setIncome] = useState();
  const [startEndDate, setStartEndDate] = useState();
  useEffect(() => {
    const getToken = async () => {
      const localStorageToken = await localStorage.getItem(
        "drivers_diary_token"
      );
      if (localStorageToken) {
        const profileFromToken = jwt_decode(localStorageToken);
        setProfile(profileFromToken);
        fetchIncome(profileFromToken,localStorageToken);
      } else {
        navigate("/signin");
      }
    };
    getToken();
  },[]);
  const fetchIncome = async (profile,token) => {
    const date = new Date();
    try {
      const data = (
        await axios.get(
          `${backendURL}/diaries/${profile.email}/income?date=${date}`,
          { "headers": { 'Authorization': token } }
        )
      ).data;
      if (data.success) {
        setIncome(data.msg.income);
        setStartEndDate({
          endDate: data.msg.endDate,
          startDate: data.msg.startDate,
        });
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("something went wrong please try again later!");
    }
  };
  return (
    <div>
      <div>
        <Navbar user={profile} />
      </div>
      <div>
        
      {
          income&&<table className='income_table mt-3'>
          <tbody>
            <tr className='income_gray'>
              <td >
                Gross Amount ({income.grossAmount.count})
              </td>
              <td>
              ${income.grossAmount.total}
              </td>
            </tr>
            <tr className='income_gray'>
              <td>
                Less dispatcher's share({profile.dispacherPercentage}%)
              </td>
              <td>
              ${income.dispatcherShare}
              </td>
            </tr>
            <tr className='income_blue'>
              <td>
                GROSS PAYABLE
              </td>
              <td>
              ${income.gross_payable.toFixed(2)}
              </td>
            </tr>
            <tr className='income_gray' >
              <td>
                Less Fuel({income.expensesObj.fuel.count})
              </td>
              <td>
              ${income.expensesObj.fuel.total.toFixed(2)}
              </td>
            </tr>
            <tr className='income_gray'>
              <td> Less Insurance({income.expensesObj.insurance.count})
              </td>
              <td>
              ${income.expensesObj.insurance.total}
              </td>
            </tr>
            <tr className='income_gray'>
              <td> Less Keep tracking({income.expensesObj.keep_tracking.count})
              </td>
              <td>
              ${income.expensesObj.keep_tracking.total.toFixed(2)}
              </td>
            </tr>
            <tr className='income_gray'>
              <td>
                Less Other({income.expensesObj.other.count})
              </td>
              <td>
              ${income.expensesObj.other.total.toFixed(2)}
              </td>
            </tr>
            <tr className='income_blue'>
              <td>
                INCOME OVER EXPENSES 
              </td>
              <td>
              ${income.income_over_expense.toFixed(2)}
              </td>
            </tr>
            <tr className='income_blue'>
              <td>
                DRIVER'S SHARE ({income.driver_share}%)
              </td>
              <td>
              ${income.netSettlement.toFixed(2)}
              </td>
            </tr>
           
          </tbody>
        </table>
        }
      </div>
    </div>
  );
}
