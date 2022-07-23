import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './style.css';
import Home from './pages/Home';
import { DataContext } from './Context';
import { useContext } from 'react';

function App() {
  const { UserStatus } = useContext(DataContext);
  const userStatus = UserStatus[0];

  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={userStatus ? <Home /> : <Login />} />
          <Route path='/signup' element={userStatus ? <Home /> : <Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
