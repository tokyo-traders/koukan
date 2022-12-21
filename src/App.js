import './App.css';
import './componenet/NavBar.css'
import NavBar from './componenet/NavBar';

import axios from "axios";
import { useEffect} from "react";



function App() {
  
  useEffect(()=>{
    axios
    .get(`/api`)
    .then((response) => {
       console.log(response.data)
    })
  }, [])

  
  return (
   <>
      <NavBar />

    </>

  );
}

export default App;
