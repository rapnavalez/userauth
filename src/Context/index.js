import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = (props) => {
  const [user, setUser] = useState({});
  const [formInput, setformInput] = useState({});
  const [errors, setErrors] = useState([]);
  const [userStatus, setUserStatus] = useState(false);

  const checkCookie = () => {
    const user = document.cookie.split(';');
    if (user.includes(' loginCookie=')) {
      setUserStatus(true);
    } else {
      setUserStatus(false);
    }
  };

  useEffect(checkCookie, []);

  const getUser = () => {
    const id = user._id;
    if (!id) return;
    axios
      .get(`/api/user/`, {
        token: 'token',
      })
      .then((res) => {
        setUser(res);
      })
      .catch((err) => console.log(err));
  };

  const getUserInput = (e) => {
    const target = e.target.name;
    const value = e.target.value;

    switch (target) {
      case 'name':
        setformInput((prev) => ({ ...prev, name: value }));
        break;
      case 'email':
        setformInput((prev) => ({ ...prev, email: value }));
        break;
      case 'password':
        setformInput((prev) => ({ ...prev, password: value }));
        break;
      case 'confirmPassword':
        setformInput((prev) => ({ ...prev, confirmPassword: value }));
        break;
      default:
        break;
    }
  };

  return (
    <DataContext.Provider
      value={{
        User: [user, setUser],
        FormInput: [formInput, setformInput],
        Errors: [errors, setErrors],
        UserStatus: [userStatus, setUserStatus],
        getUserInput,
        getUser,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
