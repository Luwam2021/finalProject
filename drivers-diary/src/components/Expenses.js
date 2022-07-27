import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Navbar from "./Navbar";
import AddExpense from "./AddExpense";
import ListExpenses from "./ListExpenses";
import EditExpense from "./EditExpense";
import { backendURL, ExpenseProvider } from "./globalContext";

export default function Expenses() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const [page, setPage] = useState("list");
  const [expenses, setExpenses] = useState([]);
  const [startEndDate, setStartEndDate] = useState();
  const [token, setToken] = useState();
  const [expenseToEdit, setExpenseToEdit] = useState();
  useEffect(() => {
    const getToken = async () => {
      const localStorageToken = await localStorage.getItem(
        "drivers_diary_token"
      );
      if (localStorageToken) {
        const profileFromToken = jwt_decode(localStorageToken);
        setToken(localStorageToken);
        setProfile(profileFromToken);
        fetchExpenses(profileFromToken,localStorageToken);
      } else {
        navigate("/signin");
      }
    };
    getToken();
  }, []);
  const fetchExpenses = async (profile,token) => {
    
    const date = new Date();
    try {
      const data = (
        await axios.get(
          `${backendURL}/diaries/${profile.email}/expenses?date=${date}`,
          { "headers": { 'Authorization': token } }
        )
      ).data;
      if (data.success) {
        setExpenses(data.msg.expenses);
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
  async function deleteExpense(expense) {
    await axios.delete(
      `${backendURL}/diaries/${profile.email}/expenses/${expense._id}?endDate=${startEndDate.endDate}`,{ "headers": { 'Authorization': token } }
    );
    const expensesCopy = expenses.filter((item) => item._id !== expense._id);
    setExpenses(expensesCopy);
  }
  async function editExpense(expense) {
    setExpenseToEdit(expense);
    setPage("edit");
  }
  return (
    <div>
      {profile && <Navbar user={profile} />}
      <ExpenseProvider
        value={{
          expenses,
          profile,
          setPage,
          editExpense,
          deleteExpense,
          setExpenses,
          fetchExpenses,
          startEndDate,
          token
        }}
      >
        {page === "add" && <AddExpense />}
        {page === "list" && <ListExpenses />}
        {page === "edit" && <EditExpense expenseToEdit={expenseToEdit} />}
      </ExpenseProvider>
    </div>
  );
}
