import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../Context';
import axios from 'axios';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessages from '../../components/Error';
import InputsAndLabels from '../../components/InputsAndLabels';
import data from './data';

export default function Login() {
  const { Errors, FormInput, getUserInput, fetchUser } =
    useContext(DataContext);
  const setErrors = Errors[1];
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
          <SuccessMessage />
          <h2 className='login--title text-dark'>Login</h2>
          <ErrorMessages clear={clear} />
          {data.map((item, index) => (
            <InputsAndLabels
              key={index}
              {...item}
              inputOnChangeHandler={getUserInput}
            />
          ))}
          <Link
            to='/passwordreset'
            className='text-link-secondary'
            onClick={clear}
          >
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
