import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';
import ErrorMessages from '../../components/Error';
import InputsAndLabels from '../../components/InputsAndLabels';
import data from './data';

export default function Signup() {
  const navigate = useNavigate();
  const { FormInput, Errors, getUserInput, Email } = useContext(DataContext);
  const [formInput, setFormInput] = FormInput;
  const setErrors = Errors[1];
  const setEmail = Email[1];

  const confirmPasswordLabel = document.querySelector('.confirmPassword-label');
  const confirmPassword = document.querySelector('#confirmPassword');

  const signUpHandler = async (e) => {
    e.preventDefault();

    if (confirmPassword.value !== formInput.password) {
      confirmPassword.classList.add('inputError');
      confirmPasswordLabel.classList.add('inputError-label');
      confirmPasswordLabel.classList.add('errorAnimation');
      setErrors([]);
      return;
    }

    confirmPassword.classList.remove('inputError');
    confirmPasswordLabel.classList.remove('inputError-label');

    await axios
      .post('/api/signup', {
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
      });
  };

  const clear = () => {
    setErrors([]);
    setFormInput({});
  };

  return (
    <section className='signup'>
      <div className='container'>
        <form className='signup--form bg-light' onSubmit={signUpHandler}>
          <h2 className='signup--title text-dark'>Sign up</h2>
          <ErrorMessages clear={clear} />
          {data.map((item, index) => (
            <InputsAndLabels
              key={index}
              {...item}
              inputOnChangeHandler={getUserInput}
            />
          ))}
          <button
            className='signup--submit btn-primary'
            type='submit'
            name='submit'
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
}
