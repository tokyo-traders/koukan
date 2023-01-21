import React, { useEffect, useState } from "react";
import "./Sidebar.css"

function Sidebar() {

    return (
        <>
            <div className="sidebar">
                <h2>Categories</h2>
                <a href="#">
                    Storage
                </a>
                <a href="#">
                    Furniture
                </a>
                <a href="#">
                    Home Accessories
                </a>
                 <a href="#">
                    Travel Goods
                </a>
                  <a href="#">
                    Sporting Goods
                </a>
                 <a href="#">
                    Electronics
                </a>
                 <a href="#">
                    Health & Beauty
                </a>
                   <a href="#">
                    Clothing
                </a>
                   <a href="#">
                    Shoes
                </a>



            </div>
        </>
    )
}

export default Sidebar;
