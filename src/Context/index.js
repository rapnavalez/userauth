import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = (props) => {
  const [user, setUser] = useState(null);
  const [formInput, setFormInput] = useState({});
  const [errors, setErrors] = useState([]);
  const [userStatus, setUserStatus] = useState(false);
  const [email, setEmail] = useState();

  const fetchUser = async () => {
    await axios
      .get('api/user')
      .then((res) => {
        setUser(res.data);
        setUserStatus(true);
      })
      .catch((err) => {
        setUserStatus(false);
        setUser(null);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const getUserInput = (e) => {
    const target = e.target.name;
    const value = e.target.value;
    const confirmPasswordLabel = document.querySelector(
      '.confirmPassword-label'
    );
    const emailLabel =
      document.querySelector('.confirmation_email--label') ||
      document.querySelector('body');

    switch (target) {
      case 'name':
        setFormInput((prev) => ({ ...prev, name: value }));
        break;
      case 'email':
        setFormInput((prev) => ({ ...prev, email: value }));
        emailLabel.classList.remove('errorAnimation');
        break;
      case 'password':
        setFormInput((prev) => ({ ...prev, password: value }));
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
        FormInput: [formInput, setFormInput],
        Errors: [errors, setErrors],
        UserStatus: [userStatus, setUserStatus],
        Email: [email, setEmail],
        getUserInput,
        fetchUser,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
