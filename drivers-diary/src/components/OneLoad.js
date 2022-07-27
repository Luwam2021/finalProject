import  { useContext } from "react";
import {loadContext,backendURL } from "./globalContext";
export default function OneLoad({ item }) {
      const loadconsumer = useContext(loadContext);
  return (
    <tr>
      <td>{item.from}</td>
      <td>{item.to}</td>
      <td>{new Date(item.date).getDate()}</td>
      <td>{item.amount}</td>
      <td>{item.loadNumber}</td>
      <td><img src={`${backendURL}/uploads/${item.picture}`}></img></td>
      <td onClick={()=>loadconsumer.deleteLoad(item)}><span className='delete'>-</span></td>
      <td onClick={()=>loadconsumer.editLoad(item)}><span className='edit-btn'>edit</span></td>
    </tr>
  );
}
