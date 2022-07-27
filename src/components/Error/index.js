import { useContext } from 'react';
import { DataContext } from '../../Context';
import { Link } from 'react-router-dom';

export default function Errors({ clear }) {
  const { Errors } = useContext(DataContext);
  const errors = Errors[0];

  return (
    errors && (
      <>
        <div className='errors--wrapper'>
          {errors.map((err, index) => (
            <span className='errors' key={index}>
              {err}
            </span>
          ))}
        </div>
        {errors[0] === 'Your email is not verified! Please check your inbox.' ||
          (errors[0] === 'Email was already registered but not verified!' && (
            <div className='login--request_new_confirmation'>
              <Link
                onClick={clear}
                to='/confirmationemail'
                className='text-link-success success'
              >
                Request a new confirmation email?
              </Link>
            </div>
          ))}
      </>
    )
  );
}
