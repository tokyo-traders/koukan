import axios from "axios";
import './App.css';
import './componenet/Registration/Registration.css'
import { Route, Routes} from "react-router-dom";
import NavBar from './componenet/NavBar';
import Sidebar from './componenet/Sidebar';
import Trades from './componenet/Trades';
import Registration from './componenet/Registration/Registration';
import AddItem from './componenet/AddItem'; 
import { Component, useEffect } from "react";
import LoginForm from './componenet/User/LoginForm';
import SignupForm from "./componenet/User/SignupForm";
import MyPage from "./componenet/MyPage"; 



function App() {
  // const [user, setUser] = useState({name:"", email:""});
  // const [error, setError] = useState("");

  // const Login = details => {
  //   console.log(details);

  //   off(details.email == adminUser.email )
  // }

  // const Logout =() => {
  //   console.log("Logout")
  // }

  return (
    <>
      <NavBar />
      {/* <Sidebar /> */}
      <Routes>
        <Route path='/' element={<Sidebar />} exact/>
        <Route path='/' element={<Trades />}/>
        <Route path='/Login' element={<LoginForm />}/>
        <Route path='/Signup' element={<SignupForm />}/>
        <Route path='/MyPage' element={<MyPage />}/>
      </Routes>
    </>

  );
}

export default App;
