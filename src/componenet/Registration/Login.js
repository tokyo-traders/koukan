import {useRef, useState, useEffect } from "react";


function Login() {
  return (
    <>
     <header>
        Tokyo Trader
        <input type='text' id='myInput' placeholder='Serach for items'></input>
        <button type='button'>Sign In</button>
        <button type='button'>List a item</button>
     </header>
    </>
  )
}

export default Login