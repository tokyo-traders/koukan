import React, { useState, useEffect } from 'react'
import axios from "axios";



function Trades() {
  const [tradeList, setTradeList] = useState([])

  useEffect(() => {
    axios
      .get(`/api/user/all`)
      .then((response) => {
        // console.log(response)
        setTradeList(response.data)
      })
  }, [])

  return (
    <>
      {tradeList.map((trade, index) => (
        <div>{trade.first_name}</div>
      ))}
      <h1>Trades</h1>
    </>
  )
}

export default Trades