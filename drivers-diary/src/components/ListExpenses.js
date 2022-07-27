import React,{ useContext} from "react";
import OneExpense from "./OneExpense";
import {expenseContext } from "./globalContext";
export default function ListExpenses() {
  const expenseconsumer = useContext(expenseContext);
  return (
    <div>
      <br/>
       <button className='btn btn-primary mx-3' onClick={() => expenseconsumer.setPage("add")}>add expense</button>
      <br/>
      <br/>
      {!expenseconsumer.expenses.length ? <div className='noList'>
        <h3 >There are no loads currently. Click add to add new load</h3>
        </div>:<table>
        <tbody>
          <tr className='table-header'>
            <th>Reason</th>
            <th>amount</th>
            <th>date</th>
            <th>picture</th>
            <th>Delete </th>
            <th>Edit</th>
          </tr>
          {expenseconsumer.expenses.map((item) => {
            return <OneExpense item={item} />;
          })}
        </tbody>
      </table>}
    </div>
  )
}
