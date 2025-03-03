
import { Route, Routes } from 'react-router-dom';
import './App.css';
import '../src/CSS/jay.css'
import Home from "./Page/Home";
import Login from './Page/Login';
import { configureStore } from './Redux/Store';
import { Provider } from 'react-redux';
import HelpCenter from './Page/HelpCenter';
import Pricing from './Page/Pricing';

function App() {
  const { store, persistor } = configureStore();
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/helpcenter" element={<HelpCenter />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </Provider>

  );
}

export default App;
