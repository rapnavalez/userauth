import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';
import ErrorMessages from '../../components/Error';
import InputsAndLabels from '../../components/InputsAndLabels';
import data from './data';

export default function CreateNewPassword() {
  const navigate = useNavigate();
  const { FormInput, getUserInput, Errors, Email } = useContext(DataContext);
  const [formInput, setFormInput] = FormInput;
  const [errors, setErrors] = Errors;
  const setEmail = Email[1];
  const confirmPasswordLabel = document.querySelector('.confirmPassword-label');
  const confirmPassword = document.querySelector('.confirm_new_password');
  const newPasswordLabel = document.querySelector('.password-label');
  const newPassword = document.querySelector('.new_password');
  const token = window.location.pathname.split('/')[2];

  const create_new_passwordHandler = async (e) => {
    e.preventDefault();

    if (newPassword.value.length <= 7) {
      newPassword.classList.add('inputError');
      newPasswordLabel.classList.add('inputError-label');
      newPasswordLabel.classList.add('errorAnimation');
      if (errors.includes('New password must be at least 8 digits')) return;
      setErrors(['New password must be at least 8 digits']);

      return;
    }

    if (confirmPassword.value !== formInput.password) {
      confirmPassword.classList.add('inputError');
      confirmPasswordLabel.classList.add('inputError-label');
      confirmPasswordLabel.classList.add('errorAnimation');
      if (errors.includes("Passwords doesn't matched!")) return;
      setErrors(["Passwords doesn't matched!"]);

      return;
    }

    confirmPassword.classList.remove('inputError');
    confirmPasswordLabel.classList.remove('inputError-label');

    await axios
      .patch(`/api/createnewpassword/${token}`, {
        ...formInput,
      })
      .then((res) => {
        setErrors([]);
        setFormInput({});
        setEmail(res.data);
        navigate('/login/?passwordresetsuccess', { replace: true });
      })
      .catch((err) => {
        navigate(`/passwordtokenexpired/${token}`, { replace: true });
      });
  };

  return (
    <section className='create_new_password'>
      <div className='container'>
        <form
          className='create_new_password--form bg-light'
          onSubmit={create_new_passwordHandler}
        >
          <h2 className='create_new_password--title text-dark'>
            Create a new Password
          </h2>
          <ErrorMessages />
          {data.map((item, index) => (
            <InputsAndLabels
              key={index}
              {...item}
              inputOnChangeHandler={getUserInput}
            />
          ))}
          <button
            className='create_new_password--submit btn-primary'
            type='submit'
            name='submit'
          >
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
}
