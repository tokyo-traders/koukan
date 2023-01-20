import axios from 'axios';
import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://127.0.0.1:8000/api';

export default function AllListings() {
    const [listings, setListings] = useState([{
    }]);

    useEffect(() => {
        axios
            .get('api/homepage')
            .then(response => console.log(response.data))
            .then(res => setListings(res.data))
    }, [])
    console.log(listings)
    return (
        <>
            <h1>All listings</h1>
            {listings.map(listing => (

                < h3 > {listing.id}</h3>
            ))
            }
        </>
    )
} 