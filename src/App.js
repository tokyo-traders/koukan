import logo from './logo.svg';
import './App.css';
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
    <div className="App">
    Hello! test

    </div>
  );
}

export default App;
