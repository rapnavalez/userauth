import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../Context';
import axios from 'axios';

export default function Login() {
  const { Errors, FormInput, getUserInput, fetchUser } =
    useContext(DataContext);
  const [errors, setErrors] = Errors;
  const [formInput, setFormInput] = FormInput;

  const inputs = document.querySelectorAll('input');
  const labels = document.querySelectorAll('label');
  const loginBtn = document.querySelector('.login--submit');

  const loginHandler = async (e) => {
    e.preventDefault();
    labels.forEach((label) => label.classList.remove('errorAnimation'));
    await axios
      .post('/api/login', {
        ...formInput,
      })
      .then((res) => {
        fetchUser();
        setErrors([]);
        setFormInput({});
        inputs.forEach((input) => input.setAttribute('disabled', true));
        loginBtn.setAttribute('disabled', true);
        loginBtn.innerHTML = `<div class='lds-ellipsis'>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>`;
      })
      .catch((err) => {
        setErrors(err.response.data);
        inputs.forEach((input) => input.classList.add('inputError'));
        labels.forEach((label) => label.classList.add('inputError-label'));
        labels.forEach((label) => label.classList.add('errorAnimation'));
      });
  };

  const clear = () => {
    setErrors([]);
    setFormInput({});
  };

  return (
    <section className='login'>
      <div className='container'>
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
                onClick={clear}
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
          <Link to='/passwordreset' className='text-link-secondary'>
            Forgot password?
          </Link>
          <button
            className='login--submit btn-primary'
            type='submit'
            name='submit'
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
