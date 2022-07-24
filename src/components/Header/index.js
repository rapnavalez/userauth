import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';
import axios from 'axios';

export default function Header() {
  const navigate = useNavigate();
  const { User, UserStatus, Errors, UserId } = useContext(DataContext);
  const user = User[0];
  const setErrors = Errors[1];
  const [userStatus, setUserStatus] = UserStatus;
  const setUserId = UserId[1];

  const logoutHandler = async () => {
    await axios
      .get('/api/logout')
      .then((res) => {
        setUserStatus(false);
        setUserId('');
        navigate('/', { replace: true });
      })
      .catch((err) => console.log(err));
  };

  const clearErrors = () => {
    setErrors([]);
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
          {userStatus ? (
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
                className='header--link text-link-dark'
                to='/login'
              >
                Login
              </Link>
              <Link
                onClick={clearErrors}
                className='header--link btn-primary'
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
