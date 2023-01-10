import axios from "axios";
import './App.css';
import './componenet/NavBar.css'
import './componenet/Registration/Registration.css'
import NavBar from './componenet/NavBar';
import Sidebar from './componenet/Sidebar';
import Trades from './componenet/Trades';
import Registration from './componenet/Registration/Registration';
import AddItem from './componenet/AddItem'; import { useEffect } from "react";
import LoginForm from './componenet/Registration/LoginForm';



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
      {/* <Trades /> */}
      {/* <Sidebar /> */}
      {/* <LoginForm /> */}
      {/* <AddItem /> */}
      {/* <LoginForm /> */}
      <AddItem />
      {/* <Registration /> */}

    </>

  );
}

export default App;
