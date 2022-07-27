import { useContext } from 'react';
import { DataContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorMessages from '../../components/Error';

export default function PasswordReset() {
  const navigate = useNavigate();
  const { getUserInput, Email, Errors, FormInput } = useContext(DataContext);
  const setErrors = Errors[1];
  const setEmail = Email[1];
  const [formInput, setFormInput] = FormInput;

  const inputs = document.querySelectorAll('input');
  const labels = document.querySelectorAll('label');

  const requestConfirmationEmailHandler = async (e) => {
    e.preventDefault();
    labels.forEach((label) => label.classList.remove('errorAnimation'));
    if (!formInput.email) return;
    if (
      !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formInput.email)
    ) {
      inputs.forEach((input) => input.classList.add('inputError'));
      labels.forEach((label) => label.classList.add('inputError-label'));
      labels.forEach((label) => label.classList.add('errorAnimation'));
      setErrors(['Invalid email!']);
      return;
    }
    await axios
      .post('/api/getpasswordresetlink', {
        ...formInput,
      })
      .then((res) => {
        setErrors([]);
        setFormInput({});
        setEmail(res.data);
        navigate('/forgotpasswordemail', { replace: true });
      })
      .catch((err) => {
        setErrors(err.response.data);
        inputs.forEach((input) => input.classList.add('inputError'));
        labels.forEach((label) => label.classList.add('inputError-label'));
        labels.forEach((label) => label.classList.add('errorAnimation'));
      });
  };

  return (
    <section className='request_new_password'>
      <div className='container'>
        <form
          className='request_new_password--form'
          onSubmit={requestConfirmationEmailHandler}
        >
          <h2 className='request_new_password--title text-success'>
            Reset your password
          </h2>
          <ErrorMessages />
          <label className='request_new_password--label email'>
            Please enter your email to continue.
          </label>
          <input
            className='request_new_password--input email'
            type='email'
            placeholder='email@email.com'
            name='email'
            id='email'
            onChange={getUserInput}
          />
          <button
            className='signup--submit btn-primary'
            type='submit'
            name='submit'
          >
            Get password reset link
          </button>
        </form>
      </div>
    </section>
  );
}
