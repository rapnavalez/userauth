import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';

export default function Signup() {
  const navigate = useNavigate();
  const { FormInput, Errors, getUserInput } = useContext(DataContext);
  const [formInput, setFormInput] = FormInput;
  const [errors, setErrors] = Errors;

  const signUpHandler = async (e) => {
    e.preventDefault();

    await axios
      .post('/api/signup', {
        ...formInput,
      })
      .then((res) => {
        setErrors([]);
        setFormInput({});
        alert(`${res.data} has been registered!`);
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  // const confirmPassword = (e) => {
  //   const target = e.target.name;
  //   const value = e.target.value;

  //   if (target !== confirmPassword) return;
  //   if (formInput.password !== value) {
  //     target.style.border = `1px solid red`;
  //   }
  // };

  return (
    <section className='signup'>
      <div className='container'>
        <form className='signup--form bg-light' onSubmit={signUpHandler}>
          <h2 className='signup--title text-dark'>Sign up</h2>
          <div className='signup--errors'>
            {errors.map((err, index) => (
              <span className='signup--error error' key={index}>
                {err}
              </span>
            ))}
          </div>
          <label className='signup--label name-label'>Name</label>
          <input
            className='signup--input'
            type='text'
            placeholder='John Doe'
            name='name'
            id='name'
            onChange={getUserInput}
          />
          <label className='signup--label email-label'>Email</label>
          <input
            className='signup--input'
            type='email'
            placeholder='email@email.com'
            name='email'
            id='email'
            onChange={getUserInput}
          />
          <label className='signup--label password-label'>Password</label>
          <input
            className='signup--input'
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
