import { useContext } from 'react';
import { DataContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CofirmationEmail() {
  const navigate = useNavigate();
  const { getUserInput, SignUpEmail, Errors, FormInput } =
    useContext(DataContext);
  const [errors, setErrors] = Errors;
  const setSignUpEmail = SignUpEmail[1];
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
      return;
    }
    await axios
      .post('/api/getnewtoken', {
        ...formInput,
      })
      .then((res) => {
        setErrors([]);
        setFormInput({});
        setSignUpEmail(res.data);
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
          <div className='confirmation_email---errors'>
            {errors
              ? errors.map((err, index) => (
                  <span
                    className='confirmation_email---error error'
                    key={index}
                  >
                    {err}
                  </span>
                ))
              : ''}
          </div>
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
