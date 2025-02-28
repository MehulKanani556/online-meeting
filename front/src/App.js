
import { Route, Routes } from 'react-router-dom';
import './App.css';
import '../src/CSS/jay.css'
import Home from "./Page/Home";
import Login from './Page/Login';
import ForgetPassword from './Page/ForgetPassword';
import OTPVerification from './Page/OTPVerification';
import ResetPassword from './Page/ResetPassword';
import { configureStore } from './Redux/Store';
import { Provider } from 'react-redux';

function App() {
  const { store, persistor } = configureStore();
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/otpVerification" element={<OTPVerification />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Provider>

  );
}

export default App;
