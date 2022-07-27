import React, { useContext, useState, useEffect } from "react";

import axios from "axios";
import { backendURL, expenseContext } from "./globalContext";
export default function EditExpense({ expenseToEdit }) {
  const expenseconsumer = useContext(expenseContext);
  const [expense, setExpense] = useState({
    reason: expenseToEdit.reason,
    amount: expenseToEdit.amount,
    date: "",
  });
  useEffect(() => {
    const dd = new Date(expenseToEdit.date);
    setExpense({ ...expense, date: dd });
  }, []);
  const changeValue = (e) => {
    const copyExpense = { ...expense };
    copyExpense[e.target.name] = e.target.value;
    setExpense(copyExpense);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let data = null;
      let expenseToAdd = expense;
      if (expense.picture) {
        const imgString = await uploadImg();
        expenseToAdd = {
          ...expense,
          picture: imgString,
        };
        data = (
          await axios.put(
            `${backendURL}/diaries/${expenseconsumer.profile.email}/expenses/${expenseToEdit._id}?endDate=${expenseconsumer.startEndDate.endDate}`,
            expenseToAdd,{ "headers": { 'Authorization': expenseconsumer.token } }
          )
        ).data;
      } else {
        expenseToAdd = { ...expense, picture: expenseToEdit.picture };
        data = (
          await axios.put(
            `${backendURL}/diaries/${expenseconsumer.profile.email}/expenses/${expenseToEdit._id}?endDate=${expenseconsumer.startEndDate.endDate}`,
            expenseToAdd,
            { "headers": { 'Authorization': expenseconsumer.token } }
          )
        ).data;
      }
      if (data.success) {
        expenseconsumer.fetchExpenses(expenseconsumer.profile,expenseconsumer.token);
        alert(data.msg);
        expenseconsumer.setPage("list");
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("something went wrong. Please try again");
    }
  };

  async function uploadImg() {
    const formData = new FormData();
    formData.append("file", expense.picture);
    try {
      const response = (
        await axios.post(`${backendURL}/diaries/files`, formData)
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
  const inputs = [
    { name: "reason", ph: "For", type: "text", min: 4, max: 50 },
    { name: "amount", ph: "Amount", type: "number" },
  ];
  return (
    <div>
      <button onClick={() => expenseconsumer.setPage("list")}>
        list expenses
      </button>
      <div className="container">
        <form onSubmit={onSubmit}>
          {inputs.map((item) => {
            const val = expense[item.name];
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
          reciept image
          <input
            className="form-control"
            type="file"
            name="picture"
            accept="image/x-png,image/gif,image/jpeg"
            onChange={selectImg}
          />
          <button type="submit" className='adding-btn btn btn-primary'> Edit</button>
        </form>
      </div>
    </div>
  );
}
