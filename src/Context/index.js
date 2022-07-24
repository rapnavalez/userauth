import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = (props) => {
  const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [formInput, setformInput] = useState({});
  const [errors, setErrors] = useState({ errors: [], errorName: [] });
  const [userStatus, setUserStatus] = useState(false);

  const checkCookie = () => {
    const cookies = document.cookie.split(';');
    cookies.forEach((cookie) => {
      if (!cookie.includes('loginCookie')) return;
      setUserId(
        cookie
          .substring(cookie.indexOf('=') + 1)
          .substring(7)
          .slice(0, -3)
      );
    });
    if (userId) {
      axios
        .post('api/user', {
          id: userId,
        })
        .then((res) => {
          setUser(res.data);
          setUserStatus(true);
        })
        .catch((err) => console.log(err));
    } else {
      setUserStatus(false);
    }
  };

  useEffect(checkCookie, [userId]);

  const getUserInput = (e) => {
    const target = e.target.name;
    const value = e.target.value;
    const confirmPasswordLabel = document.querySelector(
      '.confirmPassword-label'
    );

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
        confirmPasswordLabel.classList.remove('errorAnimation');
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
        UserId: [userId, setUserId],
        getUserInput,
        checkCookie,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
