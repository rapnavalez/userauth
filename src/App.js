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
import Expired from './pages/Expired';
import CofirmationEmail from './pages/ConfirmationEmail';

function App() {
  const { UserStatus, SignUpEmail } = useContext(DataContext);
  const userStatus = UserStatus[0];
  const signUpEmail = SignUpEmail[0];

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
            element={!signUpEmail ? <NotFound /> : <VerifyEmail />}
          />
          <Route
            path='/confirmationemail'
            element={userStatus ? <NotFound /> : <CofirmationEmail />}
          />
          <Route path='/tokenexpired/:id' element={<Expired />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
