import React from 'react'
import { users } from './config/users'

const Login = ({ setPage, extra }) => {
    const userList = users.map((user, idx) => {
        return (
            <button
                className={`list-group-item list-group-item-action`}
                onClick={(e) => setPage("Contacts", { ...extra, currentUser: users[idx] })}
                key={user[0]}
            >
                {user[1]}
            </button>
        );
    });
    return (
        <div className="row w-50 mx-auto">

            <h3 className="text-center my-3 mx-auto">Выберите пользователя</h3>

            <div className="list-group w-100">{userList}</div>

        </div>
    )
}

export default Login
