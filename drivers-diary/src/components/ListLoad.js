import React, { useContext } from "react";
import OneLoad from "./OneLoad";
import { loadContext } from "./globalContext";

export default function ListLoad() {
  const loadconsumer = useContext(loadContext);
  return (
    <div>
      <br />
      <button
        className="btn btn-primary mx-3"
        onClick={() => loadconsumer.setPage("add")}
      >
        add load
      </button>
      <br />
      <br />
     
      {!loadconsumer.loads.length ? <div className='noList'>
        <h3 >There are no loads currently. Click 'add load' to add new load</h3>
        </div>:
          <table>
          <tbody>
            <tr className="table-header">
              <th>from</th>
              <th>to</th>
              <th>date</th>
              <th>amount</th>
              <th>code</th>
              <th>picture</th>
              <th>Delete </th>
              <th>Edit</th>
            </tr>
            {loadconsumer.loads.map((item) => {
              return <OneLoad item={item} />;
            })}
          </tbody>
        </table>}
    </div>
  );
}
