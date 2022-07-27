import { Link } from 'react-router-dom';

export default function ExpiredPasswordToken() {
  return (
    <section className='expired'>
      <div className='container'>
        <div className='expired--wrapper'>
          <h2 className='expired--title text-danger'>404 Invalid Token!</h2>
          <p className='expired--message text-secondary'>
            Your Password Reset link was either expired or doesn't exist.
          </p>
          <Link className='expired--link text-link-info' to='/passwordreset'>
            Request a new password reset link
          </Link>
        </div>
      </div>
    </section>
  );
}
