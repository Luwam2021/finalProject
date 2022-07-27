import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { formatDate } from "./helper";
import { globalContext, backendURL, expenseContext } from "./globalContext";

export default function AddExpense() {
  //CONTEXT***************
  const globalconsumer = useContext(globalContext);
  const expenseconsumer = useContext(expenseContext);


  //HOOKS***********
  const navigate = useNavigate();
  useEffect(() => {
    const getToken = async () => {
      const localStorageToken = await localStorage.getItem(
        "drivers_diary_token"
      );
      if (localStorageToken) {
        setToken(localStorageToken)
        const profileFromToken = jwt_decode(localStorageToken);
        globalconsumer.setProfile(profileFromToken);
      } else {
        navigate("/signin");
      }
    };
    getToken();
  }, []);

  //STATES***********
  const [expense, setExpense] = useState({
    reason: "fuel",
    other: "",
    amount: "",
    date: null,
  });
  // const [other, setOther] = useState("");
  const [token,setToken] = useState()

  //FUNCTIONS*********
  const changeValue = (e) => {
    const copyExpense = { ...expense };
    copyExpense[e.target.name] = e.target.value;
    setExpense(copyExpense);
  };
  const changeDate = (event) => {
    setExpense({ ...expense, date: event.target.selected });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const imgString = await uploadImg();
      if (!imgString) {
        return;
      }
      let newExpense = {};
      if (expense.reason === "other") {
        newExpense = {
          date: expense.date,
          amount: expense.amount,
          reason: expense.other,
          picture: imgString,
        };
      } else {
        const { other, ...a } = expense;
        newExpense = { ...a, picture: imgString };
      }
      const data = (
        await axios.post(
          `${backendURL}/diaries/${globalconsumer.profile.email}/expenses`,
          newExpense,{headers: {"Authorization" : `${token}`} }
        )
      ).data;
      if (data.success) {
        expenseconsumer.fetchExpenses(expenseconsumer.profile,token);
        alert("expense is added");
        expenseconsumer.setPage("list");
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("something went wrong. Please try again");
    }
  };
  async function changeReason(e) {
    setExpense({ ...expense, reason: e.target.value });
  }
  async function uploadImg() {
    const formData = new FormData();
    formData.append("file", expense.picture);
    try {
      const response = (
        await axios.post(`${backendURL}/diaries/files`, formData,{headers: {"Authorization" : `${token}`} })
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
      expense.picture = file;
    }
  }

  //JSX**********************
  return (
    <div>
      <button
        className="btn btn-secondary mt-3 mx-3"
        onClick={() => expenseconsumer.setPage("list")}
      >
        list expenses
      </button>
      <div className="container">
        <form onSubmit={onSubmit}>
          <label>For</label>
          <br />
          Fuel
          <input
            checked
            name="reason"
            value="fuel"
            type="radio"
            onChange={changeReason}
          />
          &nbsp; Insurance
          <input
            name="reason"
            value="insurance"
            type="radio"
            onChange={changeReason}
          />
          &nbsp; tracking
          <input
            name="reason"
            value="keep_tracking"
            type="radio"
            onChange={changeReason}
          />
          &nbsp; other
          <input
            name="reason"
            value="other"
            type="radio"
            onChange={changeReason}
          />
          &nbsp;
          {expense.reason == "other" ? (
            <input
              className="form-control"
              type="text"
              value={expense.other}
              placeholder="please enter reason"
              name="other"
              minLength="2"
              maxLength="50"
              required
              onChange={(e) => {
                changeValue(e);
              }}
            />
          ) : null}
          <br />
          <label>Amount</label>
          <input
            className="form-control"
            type="number"
            value={expense.amount}
            name="amount"
            min="0"
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
            min={formatDate(expenseconsumer.startEndDate.startDate)}
            max={formatDate(expenseconsumer.startEndDate.endDate)}
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
          <button className="adding-btn btn btn-primary" type="submit">
            {" "}
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
