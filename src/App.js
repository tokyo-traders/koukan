import './App.css';
import './componenet/NavBar.css'
import './componenet/Registration/Registration.css'
import NavBar from './componenet/NavBar';
import Sidebar from './componenet/Sidebar';
import Trades from './componenet/Trades';
import Registration from './componenet/Registration/Registration';

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
      <Trades />
      <Sidebar />
      {/* <Registration /> */}
    </>

  );
}

export default App;
