import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';
import axios from 'axios';

export default function Header() {
  const navigate = useNavigate();
  const { User, UserStatus, Errors, FormInput } = useContext(DataContext);
  const [user, setUser] = User;
  const setErrors = Errors[1];
  const [userStatus, setUserStatus] = UserStatus;
  const setFormInput = FormInput[1];

  const logoutHandler = async () => {
    await axios
      .get('/api/logout')
      .then((res) => {
        setUser(null);
        setUserStatus(false);
        navigate('/', { replace: true });
      })
      .catch((err) => console.log(err));
  };

  const clearErrors = () => {
    setErrors([]);
    setFormInput({});
  };

  return (
    <header className='header bg-light'>
      <div className='container'>
        <div className='header--wrapper'>
          <h1 className='header--logo'>
            <Link className='text-link-primary' to='/'>
              Loaners
            </Link>
          </h1>
          {userStatus && user !== null ? (
            <div className='header--links'>
              <h4 className='header--greetings text-dark'>
                Hello,&nbsp;
                <Link className='text-link-primary' to='/'>
                  {user.name.slice(0, user.name.indexOf(' '))}
                </Link>
              </h4>
              <button
                className='header--btn btn-danger'
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='header--links'>
              <Link
                onClick={clearErrors}
                className='header--link text-link-dark login-link'
                to='/login'
              >
                Login
              </Link>
              <Link
                onClick={clearErrors}
                className='header--link btn-primary signup-link'
                to='/signup'
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
