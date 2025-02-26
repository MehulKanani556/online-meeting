
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./Page/Home";

function App() {
  return (

    <Routes>
      <Route path="/aaa" element={<Home />} />
    </Routes>

  );
}

export default App;
