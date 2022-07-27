export default function SuccessMessage() {
  let message;

  switch (window.location.search) {
    case '?passwordresetsuccess':
      message = 'Password reset successful!';
      break;
    case '?emailconfirmationsuccess':
      message = 'Email has been confirmed!';
      break;
    default:
      message = false;
      break;
  }
  return (
    message && (
      <div className='success--wrapper'>
        <p className='success--message text-response-success'>{message}</p>
      </div>
    )
  );
}
