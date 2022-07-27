import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';
import Home from './pages/Home';
import { DataContext } from './Context';
import { useContext } from 'react';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/404';
import EmailTokenExpired from './pages/Expired/EmailTokenExpired';
import PasswordTokenExpired from './pages/Expired/PasswordTokenExpired';
import CofirmationEmail from './pages/ConfirmationEmail';
import PasswordReset from './pages/PasswordReset';
import CreateNewPassword from './pages/PasswordReset/CreateNewPassword';
import ForgotPasswordEmail from './pages/ForgotPasswordEmail';
import SuccessMessage from './pages/SuccessMessage';

function App() {
  const { UserStatus, Email } = useContext(DataContext);
  const userStatus = UserStatus[0];
  const email = Email[0];

  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/login' element={userStatus ? <Home /> : <Login />} />

          <Route
            path='/signup'
            element={userStatus ? <NotFound /> : <Signup />}
          />

          <Route
            path='/verifyemail'
            element={email ? <VerifyEmail /> : <NotFound />}
          />

          <Route
            path='/confirmationemail'
            element={userStatus ? <NotFound /> : <CofirmationEmail />}
          />

          <Route
            path='/emailtokenexpired/:token'
            element={<EmailTokenExpired />}
          />

          <Route
            path='/forgotpasswordemail'
            element={email ? <ForgotPasswordEmail /> : <NotFound />}
          />

          <Route
            path='/passwordreset'
            element={userStatus ? <Home /> : <PasswordReset />}
          />
          <Route
            path='/createnewpassword/:token'
            element={<CreateNewPassword />}
          />

          <Route
            path='/createnewpassword/:token'
            element={<CreateNewPassword />}
          />

          <Route
            path='/passwordtokenexpired/:id'
            element={<PasswordTokenExpired />}
          />

          <Route path='/success' element={<SuccessMessage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
