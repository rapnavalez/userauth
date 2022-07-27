import { Link } from 'react-router-dom';

export default function SuccessMessage() {
  let message;
  if (window.location.search === '?passwordresetsuccess') {
    message = 'Password reset successful!';
  } else if ('?emailconfirmationsuccess') {
    message = 'Email has been confirmed!';
  }

  return (
    <section className='success'>
      <div className='container'>
        <div className='success--wrapper'>
          <h2 className='success--title text-success'>{message}</h2>
          <p className='success--message text-secondary'>
            You may now try to&nbsp;
            <Link className='success--link text-link-info' to='/login'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
