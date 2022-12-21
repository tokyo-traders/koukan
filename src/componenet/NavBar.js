import React from 'react'

function NavBar() {
  return (
    <>
     <header>
        Tokyo Trader
        <input type='text' id='myInput' placeholder='Serach for items'></input>
        <button type='button'>Sign In</button>
        <button>List a item</button>
     </header>
    </>
  )
}

export default NavBar