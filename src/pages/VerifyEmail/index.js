import { useContext } from 'react';
import { DataContext } from '../../Context';

export default function VerifyEmail() {
  const { SignUpEmail } = useContext(DataContext);
  const signUpEmail = SignUpEmail[0];
  return (
    <section className='verify_email'>
      <div className='container'>
        <div className='verify_email--wrapper'>
          <h2 className='verify_email--title text-success'>Email sent!</h2>
          <p className='verify_email--message text-secondary'>
            A confirmation link was sent to <span>{signUpEmail}</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
