import { useContext } from "react";
import { expenseContext } from "./globalContext";
import {backendURL} from "./globalContext";
export default function OneExpense({ item }) {
  const expenseconsumer = useContext(expenseContext);
  return (
    <tr>
      <td>{item.reason}</td>
      <td>{item.amount}</td>
      <td>{new Date(item.date).getDate()}</td>
      <td><img src={`${backendURL}/uploads/${item.picture}`}></img></td>
      <td onClick={() => expenseconsumer.deleteExpense(item)}><span className='delete'>-</span></td>
      <td onClick={() => expenseconsumer.editExpense(item)}><span className='edit-btn'>edit</span></td>
    </tr>
  );
}
