export default function NotFound() {
  return (
    <section className='not_found'>
      <div className='container'>
        <div className='not_found--wrapper'>
          <h2 className='not_found--title text-danger'>404 Page not found!</h2>
          <p className='not_found--message text-secondary'>
            The page you are looking for is not found.
          </p>
        </div>
      </div>
    </section>
  );
}
