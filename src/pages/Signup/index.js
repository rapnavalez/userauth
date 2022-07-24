import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';

export default function Signup() {
  const navigate = useNavigate();
  const { FormInput, Errors, getUserInput, SignUpEmail } =
    useContext(DataContext);
  const [formInput, setFormInput] = FormInput;
  const [errors, setErrors] = Errors;
  const setSignUpEmail = SignUpEmail[1];

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
        setSignUpEmail(res.data);
        navigate('/verifyemail', { replace: true });
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <section className='signup'>
      <div className='container'>
        <form className='signup--form bg-light' onSubmit={signUpHandler}>
          <h2 className='signup--title text-dark'>Sign up</h2>
          <div className='signup--errors'>
            {errors.errors
              ? errors.errors.map((err, index) => (
                  <span className='signup--error error' key={index}>
                    {err}
                  </span>
                ))
              : ''}
          </div>
          <label className='signup--label name'>Name</label>
          <input
            className='signup--input name'
            type='text'
            placeholder='John Doe'
            name='name'
            id='name'
            onChange={getUserInput}
          />
          <label className='signup--label email'>Email</label>
          <input
            className='signup--input email'
            type='email'
            placeholder='email@email.com'
            name='email'
            id='email'
            onChange={getUserInput}
          />
          <label className='signup--label password'>Password</label>
          <input
            className='signup--input password'
            type='password'
            placeholder='&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;'
            name='password'
            id='password'
            onChange={getUserInput}
          />
          <label className='signup--label confirmPassword-label'>
            Confirm Password
          </label>
          <input
            className='signup--input'
            type='password'
            placeholder='&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;'
            name='confirmPassword'
            id='confirmPassword'
            onChange={getUserInput}
          />
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
