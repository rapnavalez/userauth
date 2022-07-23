import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';
import axios from 'axios';

export default function Header() {
  const navigate = useNavigate();
  const { User, UserStatus } = useContext(DataContext);
  const user = User[0];
  const [userStatus, setUserStatus] = UserStatus;

  const logoutHandler = async () => {
    await axios
      .get('/api/logout')
      .then((res) => {
        setUserStatus(false);
        navigate('/', { replace: true });
      })
      .catch((err) => console.log(err));
  };

  return (
    <header className='header bg-light'>
      <div className='container'>
        <div className='header--wrapper'>
          <h1 className='header--logo'>
            <Link className='text-dark' to='/'>
              Auth
            </Link>
          </h1>
          {userStatus ? (
            <div className='header--links'>
              <Link className='header--link text-link-dark' to='/'>
                {user.name}
              </Link>
              <button
                className='header--link btn-danger'
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='header--links'>
              <Link className='header--link text-link-dark' to='/login'>
                Login
              </Link>
              <Link className='header--link btn-primary' to='/signup'>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
