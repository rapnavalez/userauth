import { Link } from 'react-router-dom';

export default function Expired() {
  return (
    <section className='expired'>
      <div className='container'>
        <div className='expired--wrapper'>
          <h2 className='expired--title text-danger'>404 Invalid Token!</h2>
          <p className='expired--message text-secondary'>
            Your confirmation link was either expired or doesn't exist.
          </p>
          <Link
            className='expired--link text-link-info'
            to='/confirmationemail'
          >
            Request a new confirmation email
          </Link>
        </div>
      </div>
    </section>
  );
}
