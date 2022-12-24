import React, { useEffect, useState } from "react";
import "./Sidebar.css"

function Sidebar() {

    return (
        <>
            <div className="sidebar">
                <h2>Categories</h2>
                <a href="#">
                    Electronics
                </a>
                <a href="#">
                    Furniture
                </a>
                <a href="#">
                    Fashion
                </a>

            </div>
        </>
    )
}

export default Sidebar;
