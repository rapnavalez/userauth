import { useContext } from 'react';
import { DataContext } from '../../Context';

export default function ForgotPasswordEmail() {
  const { Email } = useContext(DataContext);
  const email = Email[0];
  return (
    <section className='forgot_password_email'>
      <div className='container'>
        <div className='forgot_password_email--wrapper'>
          <h2 className='forgot_password_email--title text-success'>
            Email sent!
          </h2>
          <p className='forgot_password_email--message text-secondary'>
            The password reset link was sent to <span>{email}</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
