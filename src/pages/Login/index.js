import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const { UserStatus, Errors, FormInput, getUserInput, checkCookie } =
    useContext(DataContext);
  const [errors, setErrors] = Errors;
  const formInput = FormInput[0];
  const setUserStatus = UserStatus[1];

  const loginHandler = async (e) => {
    e.preventDefault();

    await axios
      .post('/api/login', {
        ...formInput,
      })
      .then((res) => {
        setErrors([]);
        setUserStatus(true);
        checkCookie();
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setErrors(err.response.data);
      });
  };

  return (
    <section className='login'>
      <div className='container'>
        <form className='login--form bg-light' onSubmit={loginHandler}>
          <h2 className='login--title text-dark'>Login</h2>
          <div className='login--errors'>
            {errors.map((err, index) => (
              <span className='login--error error' key={index}>
                {err}
              </span>
            ))}
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
