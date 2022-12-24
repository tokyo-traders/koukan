import React from 'react'

function NavBar() {
  return (
    <>
     <header>
        Tokyo Trader
        <input type='text' id='myInput' placeholder='Serach for items'></input>
        <button type='button'>Sign In</button>
        <button type='button'>List a item</button>


      {/* <div className='welcome'>
        <h2>Hi, <span>{user.first_name}</span></h2>
        <button>Logout</button>
      </div> */}

     
     </header>
    </>
  )
}

export default NavBar