import { width } from '@mui/system';
import axios from 'axios';
import "../App.css"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://127.0.0.1:8000/api';


export default function AllListings() {

    const [listings, setListings] = useState([]);
    useEffect(() => {
        axios
            .get('api/homepage')
            .then(res => {
                console.log("this is the new data", res.data)
                setListings(res.data)
            })
    }, [])


    const navigate = useNavigate();
    const makeOffer = (obj) => {
        navigate(`/listing/${obj.post.id}`, { replace: true })
    }
    return (
        <div className='listing'>
            {listings && listings.map(listing => (
                <div className='listingClass'
                    onClick={() => {
                        if (listing) {
                            makeOffer(listing)
                        }
                    }}>
                    <img alt="image1" width="220px" src={BASE_URL + `${listing?.images[0]}`} />
                    < h3 > {listing.item.item_name}</h3>
                </div>
            ))
            }
        </div>
    )
} 