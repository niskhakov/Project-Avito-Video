import React, { useState, useEffect } from "react";
import { users } from './config/users'
import getSocket, { initConnection } from './config/socket'
import { registerWebrtcCallback, handleData, handleReady } from "./config/webrtc"

function arraysEqual(a, b) {
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length)  // assert same length
      return false;
    for (var i = 0; i < a.length; i++)  // assert each element equal
      if (!arraysEqual(a[i], b[i]))
        return false;
    return true;
  } else {
    return a === b;  // if not both arrays, should be the same
  }
}



const Contacts = ({ setPage, extra }) => {
  let currentUser = extra.selectedUser && extra.selectedUser !== 0 ? extra.selectedUser : extra.currentUser
  initConnection(currentUser[0])
  // console.log(getSocket())
  const [selectedUser, setSelectedUser] = useState(currentUser);
  const userList = []
  userList.push(extra.currentUser)
  userList.push(...users.filter(item => item[0] !== extra.currentUser[0]))


  const userGroup = userList.map((user, idx) => {
    const active = selectedUser[0] === user[0] ? "active" : "";
    const iam = user[0] === extra.currentUser[0] ? "font-weight-bold" : ""
    return (
      <button
        className={`postition-relative list-group-item list-group-item-action ${active} ${iam}`}
        onClick={(e) => { setSelectedUser(userList[idx]) }}
        key={user[0]}
      >
        {user[1]}
      </button>
    );
  });


  const displayNoneCurrent = arraysEqual(selectedUser, extra.currentUser) ? 'd-none' : ''

  useEffect(() => {
    // Connect after making sure that local stream is availble
    getSocket().connect()
    // getSocket().emit("login", { username: extra.currentUser[0], auth: "auth-token" })
  })

  const webrtcCallback = () => {
    const ex = { ...extra, selectedUser: ["incoming", "incoming call"] }
    console.log(ex)
    setPage("Call", ex)
  }

  registerWebrtcCallback("incoming_call", webrtcCallback)

  return (
    <div className="row">
      <div className="col-lg-4 col-xl-3">
        <h3 className="text-center my-3">Контакты</h3>
        <div className="row">
          <div className="list-group w-100">{userGroup}</div>

          <div className="btn btn-outline-danger w-100 mt-5" onClick={
            () => document.location.reload()
          }>Выйти</div>
        </div>
      </div>
      <div className="col-lg-8 col-xl-9">
        <div className="container">
          <div className="row justify-content-center flex-column align-items-center">
            <h3 className="mb-5 mt-3">Информация о контакте</h3>
            <div className="border border-danger contact-img rounded-circle overflow-hidden">
              <img
                src={`https://robohash.org/${selectedUser[0]}has?set=set4`}
                className="img-fluid"
                style={{ zIndex: -1, width: "100%" }}
                alt="User avatar"
              />
            </div>
          </div>
          <div className="row justify-content-center mt-3 mb-2">
            <div
              className="btn btn-outline-info disabled m-3 btn-info-id"
              style={{ cursor: "default" }}
            >
              @{selectedUser[0]}
            </div>

            <div
              className={`btn btn-outline-success m-3 callBtn ${displayNoneCurrent}`}
              onClick={() => setPage("Call", { ...extra, selectedUser: selectedUser })}
            >
              Позвонить
            </div>
            <a href="#" className={`btn btn-outline-primary m-3 ${displayNoneCurrent}`}>
              Написать
            </a>
          </div>
          <div className="row m-3">
            <p className="lead">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
              necessitatibus atque earum porro et! Odit consequuntur aut
              reprehenderit nemo impedit illo culpa laboriosam, sapiente nam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
