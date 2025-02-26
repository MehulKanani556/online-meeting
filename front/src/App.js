
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./Page/Home";
import Login from './Page/Login';

function App() {
  return (

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>

  );
}

export default App;
