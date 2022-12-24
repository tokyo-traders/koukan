import axios from "axios";
import { useEffect, useState} from "react";
import './App.css';
import './componenet/NavBar.css'
import './componenet/Registration/Registration.css'
import NavBar from './componenet/NavBar';
import Trades from './componenet/Trades';
import Registration from './componenet/Registration/Registration';

import Sidebar from './componenet/Sidebar';
import LoginForm from './componenet/Registration/LoginForm';
import { off } from "process";



function App() {

  const [user, setUser] = useState({name:"", email:""});
  const [error, setError] = useState("");

  const Login = details => {
    console.log(details);

    off(details.email == adminUser.email )
  }

  const Logout =() => {
    console.log("Logout")
  }
  
  return (
   <>
      <NavBar />
      <Trades />
      <Sidebar />
      <LoginForm Login={Login} error={error} />
    </>

  );
}

export default App;
