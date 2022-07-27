import { useContext } from 'react';
import { DataContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorMessages from '../../components/Error';

export default function CofirmationEmail() {
  const navigate = useNavigate();
  const { getUserInput, Errors, FormInput, Email } = useContext(DataContext);
  const setErrors = Errors[1];
  const [formInput, setFormInput] = FormInput;
  const setEmail = Email[1];

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
      .post('/api/getnewtoken', {
        ...formInput,
      })
      .then((res) => {
        setErrors([]);
        setFormInput({});
        setEmail(res.data);
        navigate('/verifyemail', { replace: true });
      })
      .catch((err) => {
        setErrors(err.response.data);
        inputs.forEach((input) => input.classList.add('inputError'));
        labels.forEach((label) => label.classList.add('inputError-label'));
        labels.forEach((label) => label.classList.add('errorAnimation'));
      });
  };

  return (
    <section className='confirmation_email'>
      <div className='container'>
        <form
          className='confirmation_email--form'
          onSubmit={requestConfirmationEmailHandler}
        >
          <h2 className='confirmation_email--title text-success'>
            Request a new confirmation email
          </h2>
          <ErrorMessages />
          <label className='confirmation_email--label email'>
            Please enter your email to continue.
          </label>
          <input
            className='confirmation_email--input email'
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
            Get confirmation email
          </button>
        </form>
      </div>
    </section>
  );
}
