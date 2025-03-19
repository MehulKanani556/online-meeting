
import { Route, Routes } from 'react-router-dom';
import './App.css';
import '../src/CSS/jay.css'
import Home from "./Page/Home";
import Login from './Page/Login';
import { configureStore } from './Redux/Store';
import { Provider } from 'react-redux';
import HelpCenter from './Page/HelpCenter';
import Pricing from './Page/Pricing';
import Index from './Page/Index';
import Payment from './Page/Payment';
import ContactUs from './Page/ContactUs';
import Meeting from './Page/Meeting';
import Alert from './Page/Alert';
import { SnackbarProvider } from 'notistack';
import Setting from './Page/Setting';
import Schedule from './Page/Schedule';
import Test from './Page/Test';

function App() {
  const { store, persistor } = configureStore();
  return (
    <SnackbarProvider autoHideDuration={3000}>
      <Provider store={store}>
        <Alert />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/helpcenter" element={<HelpCenter />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/home" element={<Home />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Provider>
    </SnackbarProvider>

  );
}

export default App;
