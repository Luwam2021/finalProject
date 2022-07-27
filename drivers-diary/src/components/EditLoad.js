import React, { useContext, useState, useEffect } from "react";

import axios from "axios";
import { backendURL, loadContext } from "./globalContext";

export default function EditLoad({ loadToEdit }) {
  const loadconsumer = useContext(loadContext);
  const [load, setLoad] = useState({
    from: loadToEdit.from,
    to: loadToEdit.to,
    date: "",
    amount: loadToEdit.amount,
    picture: "",
    loadNumber: loadToEdit.loadNumber,
  });
  useEffect(() => {
    const dd = new Date(loadToEdit.date);
    setLoad({ ...load, date: dd });
  }, []);
  const changeValue = (e) => {
    const copyLoad = { ...load };
    copyLoad[e.target.name] = e.target.value;
    setLoad(copyLoad);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let data = null;
      let loadToAdd = load;
      if (load.picture) {
        const imgString = await uploadImg();
        loadToAdd = {
          ...load,
          picture: imgString,
        };
        data = (
          await axios.put(
            `${backendURL}/diaries/${loadconsumer.profile.email}/loads/${loadToEdit._id}?endDate=${loadconsumer.startEndDate.endDate}`,
            loadToAdd,
            { headers: { Authorization: loadconsumer.token } }
          )
        ).data;
      } else {
        loadToAdd = { ...load, picture: loadToEdit.picture };
        data = (
          await axios.put(
            `${backendURL}/diaries/${loadconsumer.profile.email}/loads/${loadToEdit._id}?endDate=${loadconsumer.startEndDate.endDate}`,
            loadToAdd,
            { headers: { Authorization: loadconsumer.token } }
          )
        ).data;
      }
      if (data.success) {
        loadconsumer.fetchLoads(loadconsumer.profile,loadconsumer.token);
        alert("load is edited");
        loadconsumer.setPage("list");
      } else {
        alert(data.msg);
      }
    } catch (e) {
      alert("something went wrong. Please try again");
    }
  };

  async function uploadImg() {
    const formData = new FormData();
    formData.append("file", load.picture);
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
      load.picture = file;
    }
  }
  const inputs = [
    { name: "from", ph: "From", type: "text", min: 4, max: 50 },
    { name: "to", ph: "To", type: "text", min: 4, max: 50 },
    { name: "loadNumber", ph: "Load Number", type: "text", min: 3, max: 10 },
    { name: "amount", ph: "Gross amount", type: "number" },
  ];
  return (
    <div>
      <button onClick={() => loadconsumer.setPage("list")}>list loads</button>
      <div className="container">
        <form onSubmit={onSubmit}>
          {inputs.map((item) => {
            const val = load[item.name];
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
