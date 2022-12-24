import './App.css';
import './componenet/NavBar.css'
import NavBar from './componenet/NavBar';
import Sidebar from './componenet/Sidebar';
import Trades from './componenet/Trades';

import axios from "axios";
import { useEffect } from "react";





function App() {

  useEffect(() => {
    axios
      .get(`/api`)
      .then((response) => {
        console.log(response.data)
      })
  }, [])


  return (
    <>
      <NavBar />
      <Sidebar />
      <Trades />
    </>

  );
}

export default App;
