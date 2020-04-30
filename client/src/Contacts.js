import React, { useState } from "react";

const users = [
  ["nail", "Наиль"],
  ["vladimir", "Владимир"],
  ["margarita", "Маргарита"],
  ["dameli", "Дамели"],
  ["evgeniy", "Евгений"],
];

const Contacts = ({ setPage, extra }) => {
  extra = extra && extra.length != 0 ? extra : users[0];
  const [currentUser, setCurrentUser] = useState(extra);
  const userList = users.map((user, idx) => {
    const active = currentUser[0] === user[0] ? "active" : "";
    return (
      <button
        className={`list-group-item list-group-item-action ${active}`}
        onClick={(e) => setCurrentUser(users[idx])}
        key={user[0]}
      >
        {user[1]}
      </button>
    );
  });
  return (
    <div className="row">
      <div className="col-lg-4 col-xl-3">
        <h3 className="text-center my-3">Поиск</h3>
        <div className="row">
          <div className="list-group w-100">{userList}</div>
        </div>
      </div>
      <div className="col-lg-8 col-xl-9">
        <div className="container">
          <div className="row justify-content-center flex-column align-items-center">
            <h3 className="mb-5 mt-3">Информация о контакте</h3>
            <div className="border border-danger contact-img rounded-circle overflow-hidden">
              <img
                src={`https://robohash.org/${currentUser[0]}has?set=set4`}
                className="img-fluid"
                style={{ zIndex: -1, width: "100%" }}
              />
            </div>
          </div>
          <div className="row justify-content-center mt-3 mb-2">
            <div
              className="btn btn-outline-info disabled m-3 btn-info-id"
              style={{ cursor: "default" }}
            >
              @{currentUser[0]}
            </div>
            <div
              className="btn btn-outline-success m-3 callBtn"
              onClick={() => setPage("Call", currentUser)}
            >
              Позвонить
            </div>
            <a href="#" className="btn btn-outline-primary m-3">
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
