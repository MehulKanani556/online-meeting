
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

function App() {
  const { store, persistor } = configureStore();
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/helpcenter" element={<HelpCenter />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    </Provider>

  );
}

export default App;
