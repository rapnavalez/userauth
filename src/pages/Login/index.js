import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../../Context';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const { UserStatus, Errors, FormInput, getUserInput, fetchUser } =
    useContext(DataContext);
  const [errors, setErrors] = Errors;
  const [formInput, setFormInput] = FormInput;
  const [userStatus, setUserStatus] = UserStatus;

  const inputs = document.querySelectorAll('input');
  const labels = document.querySelectorAll('label');

  const loginHandler = async (e) => {
    e.preventDefault();
    labels.forEach((label) => label.classList.remove('errorAnimation'));
    await axios
      .post('/api/login', {
        ...formInput,
      })
      .then((res) => {
        setErrors([]);
        setUserStatus(true);
        setFormInput({});
        fetchUser();
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setErrors(err.response.data);
        inputs.forEach((input) => input.classList.add('inputError'));
        labels.forEach((label) => label.classList.add('inputError-label'));
        labels.forEach((label) => label.classList.add('errorAnimation'));
      });
  };

  const clearErrors = () => {
    setErrors([]);
    setFormInput({});
  };

  return (
    <section className='login'>
      <div className='container'>
        {!userStatus ? (
          <form className='login--form bg-light' onSubmit={loginHandler}>
            <h2 className='login--title text-dark'>Login</h2>
            <div className='login--errors'>
              {errors
                ? errors.map((err, index) => (
                    <span className='login--error error' key={index}>
                      {err}
                    </span>
                  ))
                : ''}
            </div>
            <div className='login--request_new_confirmation'>
              {errors[0] ===
              'Your email is not verified! Please check your inbox.' ? (
                <Link
                  onClick={clearErrors}
                  to='/confirmationemail'
                  className='text-link-success success'
                >
                  Request a new confirmation email?
                </Link>
              ) : (
                ''
              )}
            </div>
            <label className='login--label'>Email</label>
            <input
              className='login--input'
              type='email'
              placeholder='email@email.com'
              name='email'
              onChange={getUserInput}
            />
            <label className='login--label'>Password</label>
            <input
              className='login--input'
              type='password'
              placeholder='&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;'
              name='password'
              onChange={getUserInput}
            />
            <button
              className='login--submit btn-primary'
              type='submit'
              name='submit'
            >
              Login
            </button>
          </form>
        ) : (
          <div className='already_loggedin--wrapper'>
            <h2 className='already_loggedin--title text-danger'>Hey!</h2>
            <p className='already_loggedin--message text-secondary'>
              You are already logged in.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
