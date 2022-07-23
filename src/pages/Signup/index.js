import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';

export default function Signup() {
  const navigate = useNavigate();
  const { Data, Errors, getUserInput } = useContext(DataContext);
  const data = Data[0];
  const [errors, setErrors] = Errors;

  const signUp = async (e) => {
    e.preventDefault();

    await axios
      .post('/api/signup', {
        ...data,
      })
      .then((res) => {
        setErrors([]);
        alert(`${res.data} has been registered!`);
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <section className='signup'>
      <div className='container'>
        <form className='signup--form bg-light' onSubmit={signUp}>
          <h2 className='signup--title text-dark'>Sign up</h2>
          <div className='signup--errors'>
            {errors.map((err, index) => (
              <span className='signup--error error' key={index}>
                {err}
              </span>
            ))}
          </div>
          <label className='signup--label'>Name</label>
          <input
            className='signup--input'
            type='text'
            placeholder='John Doe'
            name='name'
            onChange={getUserInput}
          />
          <label className='signup--label'>Email</label>
          <input
            className='signup--input'
            type='email'
            placeholder='email@email.com'
            name='email'
            onChange={getUserInput}
          />
          <label className='signup--label'>Password</label>
          <input
            className='signup--input'
            type='password'
            placeholder='&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;'
            name='password'
            onChange={getUserInput}
          />
          <label className='signup--label'>Confirm Password</label>
          <input
            className='signup--input'
            type='password'
            placeholder='&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;'
            name='confirmPassword'
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
